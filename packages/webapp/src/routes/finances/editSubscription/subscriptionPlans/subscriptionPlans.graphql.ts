import { gql } from '../../../../shared/services/graphqlApi/__generated/gql';

export const subscriptionPlansAllQuery = gql(/* GraphQL */ `
  query subscriptionPlansAllQuery {
    allSubscriptionPlans(first: 100) {
      edges {
        node {
          id
          pk
          product {
            id
            name
          }
          unitAmount
        }
      }
    }
  }
`);

export const SUBSRIPTION_PRICE_ITEM_FRAGMENT = gql(/* GraphQL */ `
  fragment subscriptionPriceItemFragment on StripePriceType {
    id
    pk
    product {
      id
      name
    }
    unitAmount
  }
`);
