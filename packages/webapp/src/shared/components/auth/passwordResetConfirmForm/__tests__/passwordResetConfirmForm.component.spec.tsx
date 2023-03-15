import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { append } from 'ramda';

import { composeMockedQueryResult } from '@sb/webapp-api-client/tests/utils/fixtures';
import { render } from '../../../../../tests/utils/rendering';
import { PasswordResetConfirmForm, PasswordResetConfirmFormProps } from '../passwordResetConfirmForm.component';
import { authRequestPasswordResetConfirmMutation } from '../passwordResetConfirmForm.graphql';

describe('PasswordResetConfirmForm: Component', () => {
  const defaultProps: PasswordResetConfirmFormProps = {
    user: 'user-id',
    token: 'token-value',
  };

  const defaultVariables = {
    input: { newPassword: 'new-password', user: 'user-id', token: 'token-value' },
  };

  const formData = {
    newPassword: 'new-password',
    confirmPassword: 'new-password',
  };

  const fillForm = async (data = {}) => {
    const d = { ...formData, ...data };
    await userEvent.type(await screen.findByLabelText(/^new password$/i), d.newPassword);
    if (d.confirmPassword) {
      await userEvent.type(screen.getByLabelText(/^repeat new password$/i), d.confirmPassword);
    }
  };

  const sendForm = async () => {
    await userEvent.click(screen.getByRole('button', { name: /^confirm the change$/i }));
  };

  const Component = (props: Partial<PasswordResetConfirmFormProps>) => (
    <PasswordResetConfirmForm {...defaultProps} {...props} />
  );

  it('should show success message if action completes successfully', async () => {
    const requestMock = composeMockedQueryResult(authRequestPasswordResetConfirmMutation, {
      variables: defaultVariables,
      data: {
        passwordResetConfirm: {
          ok: true,
        },
      },
    });
    render(<Component />, {
      apolloMocks: append(requestMock),
    });

    await fillForm();
    await sendForm();

    const message = await screen.findByTestId('snackbar-message-1');
    expect(message).toHaveTextContent('🎉 Password reset successfully!');
  });

  it('should show error if required value is missing', async () => {
    const requestMock = composeMockedQueryResult(authRequestPasswordResetConfirmMutation, {
      variables: defaultVariables,
      data: {},
    });
    render(<Component />, { apolloMocks: append(requestMock) });

    await fillForm({ confirmPassword: null });
    await sendForm();

    expect(screen.getByText('Repeat new password is required')).toBeInTheDocument();
  });

  it('should show field error if action throws error', async () => {
    const errorMessage = 'The password is too common.';

    const requestMock = composeMockedQueryResult(authRequestPasswordResetConfirmMutation, {
      variables: defaultVariables,
      data: {},
      errors: [
        new GraphQLError('GraphQlValidationError', {
          extensions: { nonFieldErrors: [{ message: errorMessage, code: errorMessage }] },
        }),
      ],
    });
    render(<Component />, { apolloMocks: append(requestMock) });

    await fillForm();
    await sendForm();

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('should show generic form error if action throws error', async () => {
    const errorMessage = 'Server error';

    const requestMock = composeMockedQueryResult(authRequestPasswordResetConfirmMutation, {
      variables: defaultVariables,
      data: {},
      errors: [new GraphQLError(errorMessage)],
    });

    render(<Component />, { apolloMocks: append(requestMock) });

    await fillForm();
    await sendForm();

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
