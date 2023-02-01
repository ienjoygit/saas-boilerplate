import { act, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { produce } from 'immer';
import { createMockEnvironment, MockPayloadGenerator, RelayMockEnvironment } from 'relay-test-utils';
import { MockedResponse } from '@apollo/client/testing';
import { OperationDescriptor } from 'react-relay/hooks';

import { ConfirmEmail } from '../confirmEmail.component';
import { RoutesConfig } from '../../../../app/config/routes';
import { prepareState } from '../../../../mocks/store';
import { currentUserFactory } from '../../../../mocks/factories';
import { createMockRouterProps, render } from '../../../../tests/utils/rendering';
import configureStore from '../../../../app/config/store';
import { Role } from '../../../../modules/auth/auth.types';
import { getRelayEnv } from '../../../../tests/utils/relay';
import { fillCommonQueryWithUser } from '../../../../shared/utils/commonQuery';

describe('ConfirmEmail: Component', () => {
  const user = 'user_id';
  const token = 'token';
  const reduxInitialState = prepareState((state) => state);

  const Component = () => (
    <Routes>
      <Route path={RoutesConfig.getLocalePath(['confirmEmail'])} element={<ConfirmEmail />} />
      <Route path={RoutesConfig.getLocalePath(['login'])} element={<span>Login page mock</span>} />
    </Routes>
  );

  describe('token is invalid', () => {
    let relayEnvironment: RelayMockEnvironment;

    beforeEach(() => {
      relayEnvironment = getRelayEnv();
    });

    it('should redirect to login ', async () => {
      const routerProps = createMockRouterProps('confirmEmail', { user, token });

      render(<Component />, { reduxInitialState, routerProps, relayEnvironment });

      await waitFor(() => {
        expect(relayEnvironment).toHaveOperation('authConfirmUserEmailMutation');
      });

      await act(async () => {
        const operation = relayEnvironment.mock.getMostRecentOperation();
        relayEnvironment.mock.resolve(operation, {
          ...MockPayloadGenerator.generate(operation),
          errors: [
            {
              message: 'GraphQlValidationError',
              extensions: {
                password: [
                  {
                    message: 'Token is invalid',
                    code: 'invalid',
                  },
                ],
              },
            },
          ],
        } as any);
      });

      expect(await screen.findByText('Login page mock')).toBeInTheDocument();
    });

    it('should show error message', async () => {
      const reduxStore = configureStore(reduxInitialState);
      const routerProps = createMockRouterProps('confirmEmail', { user, token });

      render(<Component />, { reduxStore, routerProps, relayEnvironment });

      await waitFor(() => {
        expect(relayEnvironment).toHaveOperation('authConfirmUserEmailMutation');
      });

      await act(async () => {
        const operation = relayEnvironment.mock.getMostRecentOperation();
        relayEnvironment.mock.resolve(operation, {
          ...MockPayloadGenerator.generate(operation),
          errors: [
            {
              message: 'GraphQlValidationError',
              extensions: {
                password: [
                  {
                    message: 'Token is invalid',
                    code: 'invalid',
                  },
                ],
              },
            },
          ],
        } as any);
      });

      expect(reduxStore.getState()).toEqual(
        produce(reduxInitialState, (state) => {
          state.snackbar.lastMessageId = 1;
          state.snackbar.messages = [{ id: 1, text: 'Invalid token.' }];
        })
      );
    });
  });

  describe('token is valid', () => {
    describe('user is logged out', () => {
      let relayEnvironment: RelayMockEnvironment;

      beforeEach(() => {
        relayEnvironment = getRelayEnv();
      });

      it('should redirect to login ', async () => {
        const routerProps = createMockRouterProps('confirmEmail', { user, token });

        relayEnvironment.mock.queueOperationResolver((operation: OperationDescriptor) =>
          MockPayloadGenerator.generate(operation)
        );

        render(<Component />, { reduxInitialState, routerProps, relayEnvironment });

        expect(await screen.findByText('Login page mock')).toBeInTheDocument();
      });

      it('should show success message', async () => {
        const reduxStore = configureStore(reduxInitialState);
        const routerProps = createMockRouterProps('confirmEmail', { user, token });

        relayEnvironment.mock.queueOperationResolver((operation: OperationDescriptor) =>
          MockPayloadGenerator.generate(operation)
        );

        render(<Component />, { reduxStore, routerProps, relayEnvironment });

        await waitFor(() => {
          expect(reduxStore.getState()).toEqual(
            produce(reduxInitialState, (state) => {
              state.snackbar.lastMessageId = 1;
              state.snackbar.messages = [{ id: 1, text: 'Congratulations! Now you can log in.' }];
            })
          );
        });
      });
    });

    describe('user is logged in', () => {
      const loggedInReduxState = prepareState((state) => state);

      let relayEnvironment: RelayMockEnvironment;
      let apolloMocks: ReadonlyArray<MockedResponse>;

      beforeEach(() => {
        relayEnvironment = getRelayEnv();
        apolloMocks = [
          fillCommonQueryWithUser(
            createMockEnvironment(),
            currentUserFactory({
              roles: [Role.ADMIN],
            })
          ),
        ];
      });

      it('should redirect to login ', async () => {
        const routerProps = createMockRouterProps('confirmEmail', { user, token });

        render(<Component />, { reduxInitialState: loggedInReduxState, routerProps, relayEnvironment, apolloMocks });

        await waitFor(() => {
          expect(relayEnvironment).toHaveOperation('authConfirmUserEmailMutation');
        });

        await act(async () => {
          const operation = relayEnvironment.mock.getMostRecentOperation();
          relayEnvironment.mock.resolve(operation, MockPayloadGenerator.generate(operation));
        });

        expect(screen.getByText('Login page mock')).toBeInTheDocument();
      });

      it('should show success message', async () => {
        const reduxStore = configureStore(loggedInReduxState);
        const routerProps = createMockRouterProps('confirmEmail', { user, token });

        render(<Component />, { reduxStore, routerProps, relayEnvironment, apolloMocks });

        await waitFor(() => {
          expect(relayEnvironment).toHaveOperation('authConfirmUserEmailMutation');
        });

        await act(async () => {
          const operation = relayEnvironment.mock.getMostRecentOperation();
          relayEnvironment.mock.resolve(operation, MockPayloadGenerator.generate(operation));
        });

        expect(reduxStore.getState()).toEqual(
          produce(loggedInReduxState, (state) => {
            state.snackbar.lastMessageId = 1;
            state.snackbar.messages = [{ id: 1, text: 'Congratulations! Your email has been confirmed.' }];
          })
        );
      });
    });
  });
});
