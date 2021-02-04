import { all, put, takeLatest } from 'redux-saga/effects';

import { auth } from '../../shared/services/api';
import {
  LoginApiResponseData,
  LogoutApiResponseData,
  SignupApiResponseData,
} from '../../shared/services/api/auth/types';
import { ROUTES } from '../../routes/app.constants';
import { handleApiRequest, navigate } from '../helpers';
import { PromiseAction } from '../../shared/utils/reduxSagaPromise';
import history from '../../shared/utils/history';
import { getOauthUrl } from '../../shared/services/api/auth';
import { OAuthProvider } from './auth.types';
import * as authActions from './auth.actions';

function* loginResolve(response: LoginApiResponseData) {
  if (!response.isError) {
    yield navigate(ROUTES.home);
    yield put(authActions.fetchProfile());
  }
}

function* logoutResolve(response: LogoutApiResponseData) {
  if (!response.isError) {
    yield navigate(ROUTES.login);
  }
}

function* signupResolve(response: SignupApiResponseData) {
  if (!response.isError) {
    yield navigate(ROUTES.home);
    yield put(authActions.fetchProfile());
  }
}

function* oAuthLogin({ payload: provider }: PromiseAction<OAuthProvider>) {
  yield history.push(getOauthUrl(provider));
}

export function* watchAuth() {
  yield all([
    takeLatest(authActions.signup, handleApiRequest(auth.signup, signupResolve)),
    takeLatest(authActions.login, handleApiRequest(auth.login, loginResolve)),
    takeLatest(authActions.logout, handleApiRequest(auth.logout, logoutResolve)),
    takeLatest(authActions.changePassword, handleApiRequest(auth.changePassword)),
    takeLatest(authActions.fetchProfile, handleApiRequest(auth.me)),
    takeLatest(authActions.confirmEmail, handleApiRequest(auth.confirmEmail)),
    takeLatest(authActions.requestPasswordReset, handleApiRequest(auth.requestPasswordReset)),
    takeLatest(authActions.confirmPasswordReset, handleApiRequest(auth.confirmPasswordReset)),
    takeLatest(authActions.oAuthLogin, oAuthLogin),
  ]);
}
