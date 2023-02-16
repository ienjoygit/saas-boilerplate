import { Store } from '@reduxjs/toolkit';
import { Story } from '@storybook/react';
import { Elements } from '@stripe/react-stripe-js';
import { Route, Routes } from 'react-router-dom';

import { ActiveSubscriptionContext } from '../../routes/finances/activeSubscriptionContext/activeSubscriptionContext.component';
import {
  DefaultReduxState,
  DefaultTestProviders,
  DefaultTestProvidersProps,
  WrapperProps,
  getWrapper,
} from '../../tests/utils/rendering';
import { stripePromise } from '../services/stripe';

export const withActiveSubscriptionContext = (StoryComponent: Story) => {
  return (
    <Routes>
      <Route element={<ActiveSubscriptionContext />}>
        <Route
          index
          element={
            <Elements stripe={stripePromise}>
              <StoryComponent />
            </Elements>
          }
        />
      </Route>
    </Routes>
  );
};

export function withProviders<
  ReduxState extends Store = DefaultReduxState,
  P extends DefaultTestProvidersProps<ReduxState> = DefaultTestProvidersProps<ReduxState>
>(wrapperProps: WrapperProps<ReduxState, P> = {}) {
  return (StoryComponent: Story, storyContext: any) => {
    const { wrapper: WrapperComponent } = getWrapper(DefaultTestProviders, wrapperProps, storyContext) as any;
    return (
      <WrapperComponent>
        <StoryComponent />
      </WrapperComponent>
    );
  };
}
