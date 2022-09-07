import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { useAsyncDispatch } from '../../../utils/reduxSagaPromise';
import { useApiForm } from '../../../hooks/useApiForm';
import { confirmPasswordReset } from '../../../../modules/auth/auth.actions';
import { Input } from '../../forms/input';
import { FormFieldsRow } from '../../../../theme/size';
import { RoutesConfig } from '../../../../app/config/routes';
import { useSnackbar } from '../../snackbar';
import { useGenerateLocalePath } from '../../../hooks/localePaths';
import { Container, ErrorMessage, SubmitButton } from './passwordResetConfirmForm.styles';
import { ResetPasswordFormFields } from './passwordResetConfirmForm.types';

export type PasswordResetConfirmFormProps = {
  user: string;
  token: string;
};

export const PasswordResetConfirmForm = ({ user, token }: PasswordResetConfirmFormProps) => {
  const intl = useIntl();
  const snackbar = useSnackbar();
  const dispatch = useAsyncDispatch();
  const navigate = useNavigate();
  const generateLocalePath = useGenerateLocalePath();
  const {
    form: {
      register,
      formState: { errors },
      getValues,
    },
    handleSubmit,
    genericError,
    hasGenericErrorOnly,
    setApiResponse,
  } = useApiForm<ResetPasswordFormFields>({
    errorMessages: {
      nonFieldErrors: {
        invalid_token: intl.formatMessage({
          defaultMessage: 'Malformed password reset token',
          id: 'Auth / Reset password confirm / invalid token',
        }),
      },
      newPassword: {
        password_too_common: intl.formatMessage({
          defaultMessage: 'The password is too common.',
          id: 'Auth / Reset password confirm / password too common',
        }),
        password_entirely_numeric: intl.formatMessage({
          defaultMessage: "The password can't be entirely numeric.",
          id: 'Auth / Reset password confirm / password entirely numeric',
        }),
      },
    },
  });

  const onResetPassword = async (data: ResetPasswordFormFields) => {
    try {
      const res = await dispatch(
        confirmPasswordReset({
          newPassword: data.newPassword,
          user,
          token,
        })
      );
      setApiResponse(res);

      if (!res.isError) {
        navigate(generateLocalePath(RoutesConfig.login));
        snackbar.showMessage(
          intl.formatMessage({
            defaultMessage: '🎉 Password reset successfully!',
            id: 'Auth / Reset password confirm / Success message',
          })
        );
      }
    } catch {}
  };

  return (
    <Container onSubmit={handleSubmit(onResetPassword)}>
      <FormFieldsRow>
        <Input
          {...register('newPassword', {
            required: {
              value: true,
              message: intl.formatMessage({
                defaultMessage: 'Password is required',
                id: 'Auth / Reset password confirm / Old password required',
              }),
            },
            minLength: {
              value: 8,
              message: intl.formatMessage({
                defaultMessage: 'Password is too short. It must contain at least 8 characters.',
                id: 'Auth / Reset password confirm / Password too short',
              }),
            },
          })}
          type="password"
          required
          label={intl.formatMessage({
            defaultMessage: 'New password',
            id: 'Auth / Reset password confirm / Password label',
          })}
          placeholder={intl.formatMessage({
            defaultMessage: 'Write new password here...',
            id: 'Auth / Reset password confirm / Password placeholder',
          })}
          error={errors.newPassword?.message}
        />
      </FormFieldsRow>
      <FormFieldsRow>
        <Input
          {...register('confirmPassword', {
            validate: {
              required: (value) =>
                value?.length > 0 ||
                intl.formatMessage({
                  defaultMessage: 'Repeat new password is required',
                  id: 'Auth / Reset password confirm / Password required',
                }),
              mustMatch: (value) =>
                getValues().newPassword === value ||
                intl.formatMessage({
                  defaultMessage: 'Passwords must match',
                  id: 'Auth / Reset password confirm / Password must match',
                }),
            },
          })}
          type="password"
          required
          label={intl.formatMessage({
            defaultMessage: 'Repeat new password',
            id: 'Auth / Login / Confirm password label',
          })}
          placeholder={intl.formatMessage({
            defaultMessage: 'Confirm your new password here...',
            id: 'Auth / Login / Confirm password placeholder',
          })}
          error={errors.confirmPassword?.message}
        />
      </FormFieldsRow>

      {hasGenericErrorOnly && <ErrorMessage>{genericError}</ErrorMessage>}

      <SubmitButton>
        <FormattedMessage
          defaultMessage="Confirm the change"
          id="Auth / Reset password confirm / Submit button"
        />
      </SubmitButton>
    </Container>
  );
};
