import * as faker from 'faker';
import {
  Subscription,
  SubscriptionPhase,
  SubscriptionPlan,
  SubscriptionPlanName,
} from '../../shared/services/api/subscription/types';
import { createDeepFactory } from './factoryCreators';
import { paymentMethodFactory } from './stripe';

export const subscriptionPlanFactory = createDeepFactory<SubscriptionPlan>(() => ({
  id: faker.random.uuid(),
  product: {
    id: faker.random.uuid(),
    name: SubscriptionPlanName.MONTHLY,
  },
  unitAmount: faker.random.number({ min: 1000, max: 2500 }),
}));

export const subscriptionPhaseFactory = createDeepFactory<SubscriptionPhase>(() => ({
  startDate: new Date(2020, 5, 5).toString(),
  endDate: new Date(2025, 10, 10).toString(),
  trialEnd: null,
  item: {
    id: faker.random.uuid(),
    price: subscriptionPlanFactory(),
    quantity: faker.random.number(10),
  },
}));

export const subscriptionFactory = createDeepFactory<Subscription>(() => ({
  phases: [subscriptionPhaseFactory()],
  canActivateTrial: false,
  defaultPaymentMethod: paymentMethodFactory(),
  subscription: {
    id: faker.random.uuid(),
    currentPeriodStart: new Date(2020, 5, 5).toString(),
    currentPeriodEnd: new Date(2025, 10, 10).toString(),
    trialStart: null,
    trialEnd: null,
  },
}));
