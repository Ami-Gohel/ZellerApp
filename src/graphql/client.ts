import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import awsconfig from '../../aws-exports';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: awsconfig.aws_appsync_graphqlEndpoint,
    headers: {
      'x-api-key': awsconfig.aws_appsync_apiKey,
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
