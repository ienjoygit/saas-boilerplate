import { GraphQLClient } from 'graphql-request';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ENV } from '../../../app/config/env';
import { getSdk } from './__generated/types';

const url = `https://graphql.contentful.com/content/v1/spaces/${ENV.CONTENTFUL_SPACE}/environments/${ENV.CONTENTFUL_ENV}?access_token=${ENV.CONTENTFUL_TOKEN}`;

const gqlClientCore = new GraphQLClient(url);
export const client = getSdk(gqlClientCore);

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: url,
});
