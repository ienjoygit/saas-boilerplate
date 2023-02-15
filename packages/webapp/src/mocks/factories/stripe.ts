import { times } from 'ramda';
import { OperationDescriptor } from 'react-relay/hooks';
import { MockPayloadGenerator, RelayMockEnvironment } from 'relay-test-utils';

import StripeAllChargesQueryGraphql from '../../modules/stripe/__generated__/stripeAllChargesQuery.graphql';
import { stripeAllChargesQuery } from '../../routes/finances/subscriptions/subscriptions.graphql';
import {
  TransactionHistoryEntry,
  TransactionHistoryEntryInvoice,
} from '../../shared/services/api/stripe/history/types';
import {
  StripePaymentMethod,
  StripePaymentMethodCardBrand,
  StripePaymentMethodType,
} from '../../shared/services/api/stripe/paymentMethod';
import { composeMockedListQueryResult, connectionFromArray, makeId } from '../../tests/utils/fixtures';
import { createDeepFactory, createFactory } from './factoryCreators';
import { subscriptionPlanFactory } from './subscription';

export const paymentMethodFactory = createDeepFactory<StripePaymentMethod>(() => ({
  id: makeId(32),
  type: StripePaymentMethodType.Card,
  billingDetails: {
    name: 'MockLastName',
  },
  pk: 'pk-test-id',
  card: {
    id: makeId(32),
    last4: '9999',
    brand: StripePaymentMethodCardBrand.Visa,
    country: 'PL',
    expMonth: 10,
    expYear: 30,
    fingerprint: makeId(10),
    funding: 'credit',
    generatedFrom: '',
    threeDSecureUsage: {
      supported: true,
    },
    checks: {
      addressLine1Check: 'pass',
      addressPostalCodeCheck: 'pass',
      cvcCheck: 'pass',
    },
  },
  __typename: 'StripePaymentMethodType',
}));

export const transactionHistoryEntryInvoiceFactory = createFactory<TransactionHistoryEntryInvoice>(() => ({
  id: makeId(32),
  items: [
    {
      id: makeId(32),
      price: subscriptionPlanFactory(),
    },
  ],
}));

export const transactionHistoryEntryFactory = createFactory<TransactionHistoryEntry>(() => ({
  id: makeId(32),
  created: new Date(2020, 5, 5).toString(),
  amount: 500,
  paymentMethod: paymentMethodFactory(),
  billingDetails: {
    name: 'MockLastName',
  },
  invoice: null,
}));

export const fillAllStripeChargesQuery = (
  env?: RelayMockEnvironment,
  data = times(() => transactionHistoryEntryFactory(), 5)
) => {
  if (env) {
    env.mock.queueOperationResolver((operation: OperationDescriptor) =>
      MockPayloadGenerator.generate(operation, {
        ChargeConnection: () => connectionFromArray(data),
      })
    );
    env.mock.queuePendingOperation(StripeAllChargesQueryGraphql, {});
  }

  return composeMockedListQueryResult(stripeAllChargesQuery, 'allCharges', 'StripeChargeType', {
    data,
  });
};
