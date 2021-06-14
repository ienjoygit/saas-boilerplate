import React, { ComponentProps, useLayoutEffect } from 'react';

import { Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsProfileStartupCompleted } from '../../modules/startup/startup.selectors';
import { Role } from '../../modules/auth/auth.types';
import { useRoleAccessCheck } from '../../shared/hooks/useRoleAccessCheck';
import { useGenerateLocalePath } from '../useLanguageFromParams/useLanguageFromParams.hook';
import { ROUTES } from '../app.constants';
import { renderWhenTrue } from '../../shared/utils/rendering';
import { selectIsLoggedIn } from '../../modules/auth/auth.selectors';

export interface AuthRouteProps {
  allowedRoles?: Role | Role[];
}

export const AuthRoute = ({
  children,
  allowedRoles = [Role.ADMIN, Role.USER],
  ...props
}: ComponentProps<typeof Route> & AuthRouteProps) => {
  const history = useHistory();
  const isProfileStartupCompleted = useSelector(selectIsProfileStartupCompleted);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { isAllowed } = useRoleAccessCheck(allowedRoles);
  const generateLocalePath = useGenerateLocalePath();
  const fallbackUrl = isLoggedIn ? generateLocalePath(ROUTES.notFound) : generateLocalePath(ROUTES.login);

  useLayoutEffect(() => {
    if (isProfileStartupCompleted && !isAllowed) {
      history.push(fallbackUrl);
    }
  }, [fallbackUrl, history, isAllowed, isProfileStartupCompleted]);

  const renderRoute = () => <Route {...props}>{children}</Route>;
  return renderWhenTrue(renderRoute)(isProfileStartupCompleted && isAllowed);
};
