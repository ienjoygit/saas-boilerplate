import pytz
from django.utils import timezone
from djstripe import models as djstripe_models, enums as djstripe_enums

from .. import models, constants


def initialize_user(user):
    """
    Primary purpose for separating this code into its own function is the ability to mock it during tests so we utilise
    a schedule created by factories instead of relying on stripe-mock response

    :param user:
    :return:
    """
    price = models.Price.objects.get_by_plan(constants.FREE_PLAN)
    create_schedule(user=user, price=price)


def get_schedule(user=None, customer=None):
    if user:
        customer, _ = djstripe_models.Customer.get_or_create(user)
    if customer is None:
        raise Exception("Either user or customer must be defined")

    return customer.schedules.filter(status=djstripe_enums.SubscriptionScheduleStatus.active).first()


def create_schedule(price: djstripe_models.Price, user=None, customer=None):
    if user:
        customer, _ = djstripe_models.Customer.get_or_create(user)
    if customer is None:
        raise Exception("Either user or customer must be defined")

    subscription_schedule_stripe_instance = djstripe_models.SubscriptionSchedule._api_create(
        customer=customer.id, start_date='now', end_behavior="release", phases=[{'items': [{'price': price.id}]}]
    )

    return djstripe_models.SubscriptionSchedule.sync_from_stripe_data(subscription_schedule_stripe_instance)


def update_schedule(instance: djstripe_models.SubscriptionSchedule, **kwargs):
    subscription_schedule_stripe_instance = instance._api_update(**kwargs)
    return djstripe_models.SubscriptionSchedule.sync_from_stripe_data(subscription_schedule_stripe_instance)


def get_valid_schedule_phases(schedule: djstripe_models.SubscriptionSchedule):
    return [
        phase
        for phase in schedule.phases
        if timezone.datetime.fromtimestamp(phase['end_date'], tz=pytz.UTC) > timezone.now()
    ]


def get_current_schedule_phase(schedule):
    phases = get_valid_schedule_phases(schedule)
    return phases[0]


def is_current_schedule_phase_plan(
    schedule: djstripe_models.SubscriptionSchedule, plan_config: constants.SubscriptionPlanConfig
):
    current_phase = get_current_schedule_phase(schedule)
    current_price_id = current_phase['items'][0]['price']
    current_price = djstripe_models.Price.objects.get(id=current_price_id)
    return current_price.product.name == plan_config.name


def is_current_schedule_phase_trialing(schedule: djstripe_models.SubscriptionSchedule):
    current_phase = get_current_schedule_phase(schedule)
    if not current_phase['trial_end']:
        return False

    trial_end = timezone.datetime.fromtimestamp(current_phase['trial_end'], tz=pytz.UTC)
    return trial_end > timezone.now()


def update_schedule_payment_method(
    schedule: djstripe_models.SubscriptionSchedule, payment_method: djstripe_models.PaymentMethod
):
    current_phase, *rest_phases = get_valid_schedule_phases(schedule)
    current_phase['default_payment_method'] = payment_method.id
    update_schedule(schedule, phases=[current_phase, *rest_phases])
