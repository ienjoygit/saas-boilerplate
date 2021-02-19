import { createReducer } from '@reduxjs/toolkit';

import * as authActions from '../auth/auth.actions';
import { StartupState } from './startup.types';
import * as startupActions from './startup.actions';

export const INITIAL_STATE: StartupState = {
  profileStartupCompleted: false,
};

const handleProfileStartupCompleted = (state: StartupState) => {
  state.profileStartupCompleted = true;
};

export const reducer = createReducer(INITIAL_STATE, (builder) => {
  builder.addCase(startupActions.completeProfileStartup, handleProfileStartupCompleted);
});
