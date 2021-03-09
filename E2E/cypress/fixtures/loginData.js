import {
  EMPTY,
  EMPTY_EMAIL_ERROR_TEXT,
  EMPTY_PASSWORD_ERROR_TEXT,
  INVALID,
  VALID,
  WRONG_CREDENTIALS_ERROR_TEXT,
} from '../support/assertion';
import { EMPTY_INPUT, VALID_PASSWORD } from './signupData';

const INVALID_EMAIL = 'test@example.org';
const INVALID_PASSWORD = 'qwerty1';
const VALID_EMAIL = Cypress.env('EMAIL');

export default [
  {
    userEmail: EMPTY_INPUT,
    emailState: EMPTY,
    password: EMPTY_INPUT,
    passwordState: EMPTY,
    errorText: [EMPTY_EMAIL_ERROR_TEXT, EMPTY_PASSWORD_ERROR_TEXT],
  },
  {
    userEmail: EMPTY_INPUT,
    emailState: EMPTY,
    password: INVALID_PASSWORD,
    passwordState: INVALID,
    errorText: [EMPTY_EMAIL_ERROR_TEXT],
  },
  {
    userEmail: EMPTY_INPUT,
    emailState: EMPTY,
    password: VALID_PASSWORD,
    passwordState: VALID,
    errorText: [EMPTY_EMAIL_ERROR_TEXT],
  },
  {
    userEmail: INVALID_EMAIL,
    emailState: INVALID,
    password: INVALID_PASSWORD,
    passwordState: INVALID,
    errorText: [WRONG_CREDENTIALS_ERROR_TEXT],
  },
  {
    userEmail: INVALID_EMAIL,
    emailState: INVALID,
    password: EMPTY_INPUT,
    passwordState: EMPTY,
    errorText: [EMPTY_PASSWORD_ERROR_TEXT],
  },
  {
    userEmail: INVALID_EMAIL,
    emailState: INVALID,
    password: VALID_PASSWORD,
    passwordState: VALID,
    errorText: [WRONG_CREDENTIALS_ERROR_TEXT],
  },
  {
    userEmail: VALID_EMAIL,
    emailState: VALID,
    password: INVALID_PASSWORD,
    passwordState: INVALID,
    errorText: [WRONG_CREDENTIALS_ERROR_TEXT],
  },
  {
    userEmail: VALID_EMAIL,
    emailState: VALID,
    password: EMPTY_INPUT,
    passwordState: EMPTY,
    errorText: [EMPTY_PASSWORD_ERROR_TEXT],
  },
];
