import { ApiFormSubmitResponse } from '../types';
import { Role } from '../../../../modules/auth/auth.types';

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  email: string;
  roles: Role[];
}

interface ProfileApiResponseData {
  profile: ProfileData;
}

interface ApiCredentialsData {
  email: string;
  password: string;
}

export type LoginApiRequestData = ApiCredentialsData;
export type LoginApiResponseData = ApiFormSubmitResponse<LoginApiRequestData, void>;

export type SignupApiRequestData = ApiCredentialsData;
export type SignupApiResponseData = ApiFormSubmitResponse<SignupApiRequestData, ProfileApiResponseData>;

export type MeApiRequestData = void;
export type MeApiResponseData = ProfileData;

export type ChangePasswordRequestData = {
  oldPassword: string;
  newPassword: string;
};
export type ChangePasswordResponseData = ApiFormSubmitResponse<ChangePasswordRequestData, void>;

export type ConfirmEmailRequestData = { token: string; user: string };
export type ConfirmEmailResponseData = ApiFormSubmitResponse<ConfirmEmailRequestData, void>;

export type RequestPasswordResetRequestData = { email: string };
export type RequestPasswordResetResponseData = ApiFormSubmitResponse<RequestPasswordResetRequestData, void>;

export type ConfirmPasswordResetRequestData = { user: string; token: string; newPassword: string };
export type ConfirmPasswordResetResponseData = ApiFormSubmitResponse<RequestPasswordResetRequestData, void>;
