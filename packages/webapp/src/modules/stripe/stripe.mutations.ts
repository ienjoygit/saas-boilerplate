import { graphql } from 'react-relay';

graphql`
  mutation stripeDeletePaymentMethodMutation($input: DeletePaymentMethodMutationInput!, $connections: [ID!]!) {
    deletePaymentMethod(input: $input) {
      deletedIds @deleteEdge(connections: $connections)
      activeSubscription {
        defaultPaymentMethod {
          ...stripePaymentMethodFragment
        }
      }
    }
  }
`;

graphql`
  mutation stripeUpdateDefaultPaymentMethodMutation(
    $input: UpdateDefaultPaymentMethodMutationInput!
    $connections: [ID!]!
  ) {
    updateDefaultPaymentMethod(input: $input) {
      activeSubscription {
        ...subscriptionActiveSubscriptionFragment
      }
      paymentMethodEdge @appendEdge(connections: $connections) {
        node {
          # commented only because of the broken apollo types: need to fix it after migration
          #          ...stripePaymentMethodFragment @relay(mask: false)
          ...stripePaymentMethodFragment
        }
      }
    }
  }
`;

graphql`
  mutation stripeCreateSetupIntentMutation($input: CreateSetupIntentMutationInput!) {
    createSetupIntent(input: $input) {
      setupIntent {
        ...stripeSetupIntentFragment
      }
    }
  }
`;
