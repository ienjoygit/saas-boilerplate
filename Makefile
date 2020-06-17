PWD ?= pwd_unknown

export PROJECT_ROOT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
CONFIG_FILE ?= $(PROJECT_ROOT_DIR)/.awsboilerplate.json

define GetFromCfg
$(shell node -p "require('$(CONFIG_FILE)').$(1)")
endef

export ENV_STAGE ?= $(call GetFromCfg,defaultEnv)
export PROJECT_NAME ?= $(call GetFromCfg,projectName)

export AWS_DEFAULT_REGION ?= $(call GetFromCfg,aws.region)

export HOSTED_ZONE_ID := $(call GetFromCfg,envConfig.$(ENV_STAGE).hostedZone.id)
export HOSTED_ZONE_NAME := $(call GetFromCfg,envConfig.$(ENV_STAGE).hostedZone.name)
export CERTIFICATE_ARN := $(call GetFromCfg,envConfig.$(ENV_STAGE).certificate)
export CLOUD_FRONT_CERTIFICATE_ARN := $(call GetFromCfg,envConfig.$(ENV_STAGE).cloudFrontCertificate)

export ADMIN_PANEL_DOMAIN := $(call GetFromCfg,envConfig.$(ENV_STAGE).domains.adminPanel)
export API_DOMAIN := $(call GetFromCfg,envConfig.$(ENV_STAGE).domains.api)
export WEB_APP_DOMAIN := $(call GetFromCfg,envConfig.$(ENV_STAGE).domains.webApp)
export WWW_DOMAIN := $(call GetFromCfg,envConfig.$(ENV_STAGE).domains.www)

ifeq ($(CI),true)
	AWS_VAULT =
	VERSION := $(shell cat $(PROJECT_ROOT_DIR)/VERSION)
else
	AWS_VAULT_PROFILE := $(call GetFromCfg,aws.profile)
	AWS_VAULT = aws-vault exec $(AWS_VAULT_PROFILE) --
	VERSION := $(shell git describe --tags --first-parent --abbrev=11 --long --dirty --always)
endif
export VERSION

ifeq ($(user),)
# USER retrieved from env, UID from shell.
HOST_USER ?= $(strip $(if $(USER),$(USER),nodummy))
HOST_UID ?= $(strip $(if $(shell id -u),$(shell id -u),4000))
else
# allow override by adding user= and/ or uid=  (lowercase!).
# uid= defaults to 0 if user= set (i.e. root).
HOST_USER = $(user)
HOST_UID = $(strip $(if $(uid),$(uid),0))
endif

THIS_FILE := $(lastword $(MAKEFILE_LIST))
CMD_ARGUMENTS ?= $(cmd)

export HOST_USER
export HOST_UID

.PHONY: shell help build rebuild service login test clean prune version

COMPOSE_BACKEND_SHELL = docker-compose -p $(PROJECT_NAME)_$(HOST_UID) run --rm backend


shell:
ifeq ($(CMD_ARGUMENTS),)
	# no command is given, default to shell
	$(COMPOSE_BACKEND_SHELL) sh
else
	# run the command
	$(COMPOSE_BACKEND_SHELL) sh -c "$(CMD_ARGUMENTS)"
endif

version:
	@echo $(VERSION)

install-infra-cdk:
	npm install -g aws-cdk@1.41.0
	$(MAKE) -C infra/cdk install

install-serverless:
	npm install -g serverless

install-infra-functions: install-serverless
	$(MAKE) -C infra/functions install

install: install-infra-cdk install-infra-functions
	$(MAKE) -C services/backend install
	$(MAKE) -C services/workers install

setup-infra:
	chmod +x ./scripts/*.sh
	$(AWS_VAULT) scripts/cdk-bootstrap.sh

setup-docker:
	docker volume create --name=$(PROJECT_NAME)-web-backend-db-data

setup: install setup-infra setup-docker

up:
	# run as a (background) service
	$(AWS_VAULT) docker-compose -p $(PROJECT_NAME)_$(HOST_UID) up --build --force-recreate

down:
	# run as a (background) service
	docker-compose -p $(PROJECT_NAME)_$(HOST_UID) down

login: up
	# run as a service and attach to it
	docker exec -it $(PROJECT_NAME)_$(HOST_UID) sh

build-backend:
	$(AWS_VAULT) $(MAKE) -C services/backend build

build-webapp:
	$(MAKE) -C services/webapp build

build-workers:
	$(AWS_VAULT) $(MAKE) -C services/workers build

build-all:
	@echo Build version: $(VERSION)
	$(MAKE) build-backend
	$(MAKE) build-webapp
	$(MAKE) build-workers

clean:
	# remove created images
	@docker-compose -p $(PROJECT_NAME)_$(HOST_UID) down --remove-orphans --rmi all 2>/dev/null \
	&& echo 'Image(s) for "$(PROJECT_NAME):$(HOST_USER)" removed.' \
	|| echo 'Image(s) for "$(PROJECT_NAME):$(HOST_USER)" already removed.'

prune:
	# clean all that is not actively used
	docker system prune -af

test:
	# here it is useful to add your own customised tests
	docker-compose -p $(PROJECT_NAME)_$(HOST_UID) run --rm backend sh -c '\
		echo "I am `whoami`. My uid is `id -u`." && echo "Docker runs!"' \
	&& echo success

makemigrations:
	$(COMPOSE_BACKEND_SHELL) sh -c "python ./manage.py makemigrations"

migrate:
	$(COMPOSE_BACKEND_SHELL) sh -c "python ./manage.py migrate"

#
# Infrastructure deployment
#

deploy-global-infra:
	cd infra/cdk;\
	npm run build;\
	$(AWS_VAULT) cdk deploy *GlobalStack;

deploy-infra-main:
	cd infra/cdk;\
	npm run build;\
	$(AWS_VAULT) cdk deploy *MainStack;

deploy-infra-ci:
	cd infra/cdk;\
	npm run build;\
	$(AWS_VAULT) cdk deploy *CiStack;

deploy-infra-functions:
	cd infra/functions;\
	$(AWS_VAULT) sls deploy --stage $(ENV_STAGE);

deploy-stage-infra: deploy-infra-main deploy-infra-functions deploy-infra-ci

#
# Services deployment
#

deploy-components:
	cd infra/cdk;\
	npm run build;\
	$(AWS_VAULT) cdk deploy *ComponentsStack;

deploy-admin-panel:
	cd infra/cdk;\
	npm run build;\
	$(AWS_VAULT) cdk deploy *AdminPanelStack;

deploy-api:
	cd infra/cdk;\
	npm run build;\
	$(AWS_VAULT) cdk deploy *ApiStack;

deploy-migrations:
	cd infra/cdk;\
	npm run build;\
	$(AWS_VAULT) cdk deploy *MigrationsStack;

	cd infra/functions;\
	$(AWS_VAULT) sls invoke --stage $(ENV_STAGE) -f TriggerMigrationsJob

deploy-workers:
	cd services/workers;\
	$(AWS_VAULT) sls deploy --stage $(ENV_STAGE);

deploy-webapp:
	cd infra/cdk;\
	npm run build;\
	$(AWS_VAULT) cdk deploy *WebAppStack;

deploy-stage-app: deploy-components deploy-admin-panel deploy-api deploy-migrations deploy-workers deploy-webapp
