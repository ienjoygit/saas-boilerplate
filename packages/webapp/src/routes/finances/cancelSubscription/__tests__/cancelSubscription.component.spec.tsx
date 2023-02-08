import userEvent from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { MockPayloadGenerator, RelayMockEnvironment } from 'relay-test-utils';
import { append } from 'ramda';

import { CancelSubscription } from '../cancelSubscription.component';
import {
  fillSubscriptionScheduleQuery,
  paymentMethodFactory,
  subscriptionFactory,
  subscriptionPhaseFactory,
} from '../../../../mocks/factories';
import { SubscriptionPlanName } from '../../../../shared/services/api/subscription/types';
import { snackbarActions } from '../../../../modules/snackbar';
import { createMockRouterProps, render } from '../../../../tests/utils/rendering';
import { ActiveSubscriptionContext } from '../../activeSubscriptionContext/activeSubscriptionContext.component';
import { RoutesConfig } from '../../../../app/config/routes';
import { getRelayEnv } from '../../../../tests/utils/relay';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual<NodeModule>('react-redux'),
    useDispatch: () => mockDispatch,
  };
});

const fillSubscriptionScheduleQueryWithPhases = (relayEnvironment: RelayMockEnvironment, phases: any) => {
  return fillSubscriptionScheduleQuery(
    relayEnvironment,
    subscriptionFactory({
      defaultPaymentMethod: paymentMethodFactory({
        billingDetails: { name: 'Owner' },
        card: { last4: '1234' },
      }),
      phases,
    })
  );
};

const resolveSubscriptionDetailsQuery = (relayEnvironment: RelayMockEnvironment) => {
  return fillSubscriptionScheduleQueryWithPhases(relayEnvironment, [
    subscriptionPhaseFactory({
      endDate: '2020-10-10',
      item: { price: { product: { name: SubscriptionPlanName.MONTHLY } } },
    }),
    subscriptionPhaseFactory({ startDate: '2020-10-10' }),
  ]);
};

const routePath = ['subscriptions', 'list'];

const Component = () => {
  return (
    <Routes>
      <Route element={<ActiveSubscriptionContext />}>
        <Route path={RoutesConfig.getLocalePath(routePath)} element={<CancelSubscription />} />
      </Route>
    </Routes>
  );
};

describe('CancelSubscription: Component', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
  });

  it('should render current plan details', async () => {
    const relayEnvironment = getRelayEnv();
    const routerProps = createMockRouterProps(routePath);
    const requestMock = resolveSubscriptionDetailsQuery(relayEnvironment);
    const { waitForApolloMocks } = render(<Component />, {
      relayEnvironment,
      routerProps,
      apolloMocks: append(requestMock),
    });

    await waitForApolloMocks(0);

    expect(await screen.findByText(/Active plan:/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly/i)).toBeInTheDocument();
    expect(screen.getByText(/next renewal/i)).toBeInTheDocument();
    expect(screen.getByText(/October 10, 2020/i)).toBeInTheDocument();
  });

  // TODO: test > unskip after apollo mutation implement
  describe.skip('cancel button is clicked', () => {
    it('should trigger cancelSubscription action', async () => {
      const relayEnvironment = getRelayEnv();
      const routerProps = createMockRouterProps(routePath);
      const requestMock = resolveSubscriptionDetailsQuery(relayEnvironment);
      const { waitForApolloMocks } = render(<Component />, {
        relayEnvironment,
        routerProps,
        apolloMocks: append(requestMock),
      });

      await waitForApolloMocks(0);

      await userEvent.click(await screen.findByText(/cancel subscription/i));

      expect(relayEnvironment).toHaveLatestOperation('subscriptionCancelActiveSubscriptionMutation');
      expect(relayEnvironment).toLatestOperationInputEqual({});
    });
  });

  describe('cancel completes successfully', () => {
    it('should show success message and redirect to subscriptions page', async () => {
      const routerProps = createMockRouterProps(routePath);
      const relayEnvironment = getRelayEnv();
      const requestMock = resolveSubscriptionDetailsQuery(relayEnvironment);
      const { waitForApolloMocks } = render(<Component />, {
        relayEnvironment,
        routerProps,
        apolloMocks: append(requestMock),
      });

      await waitForApolloMocks(0);

      await userEvent.click(await screen.findByText(/cancel subscription/i));

      expect(mockDispatch).toHaveBeenCalledWith(
        snackbarActions.showMessage({
          text: 'You will be moved to free plan with the next billing period',
          id: 1,
        })
      );
    });
  });

  // TODO: test > unskip after apollo mutation implement
  describe.skip('cancel completes with error', () => {
    it('shouldnt show success message and redirect to subscriptions page', async () => {
      const relayEnvironment = getRelayEnv();
      const routerProps = createMockRouterProps(routePath);
      const requestMock = resolveSubscriptionDetailsQuery(relayEnvironment);
      const { waitForApolloMocks } = render(<Component />, {
        relayEnvironment,
        routerProps,
        apolloMocks: append(requestMock),
      });

      await waitForApolloMocks(0);

      await userEvent.click(await screen.findByText(/cancel subscription/i));

      const errorMessage = 'Bad Error';
      await act(async () => {
        const operation = relayEnvironment.mock.getMostRecentOperation();
        relayEnvironment.mock.resolve(operation, {
          ...MockPayloadGenerator.generate(operation),
          errors: [
            {
              message: 'GraphQlValidationError',
              extensions: {
                id: [
                  {
                    message: errorMessage,
                    code: 'invalid',
                  },
                ],
              },
            },
          ],
        } as any);
      });

      expect(mockDispatch).not.toHaveBeenCalledWith(
        snackbarActions.showMessage({
          text: 'You will be moved to free plan with the next billing period',
          id: 1,
        })
      );
    });
  });
});
