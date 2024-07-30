import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import introspectionQueryResultData from './fragmentTypes.json';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: 'include' // Include credentials to handle cookies
});

const cache = new InMemoryCache({
  possibleTypes: introspectionQueryResultData.__schema.types.reduce(
    (result, type) => {
      if (type.kind === 'UNION' || type.kind === 'INTERFACE') {
        result[type.name] = type.possibleTypes.map((subtype) => subtype.name);
      }
      return result;
    },
    {}
  ),
  typePolicies: {
    Query: {
      fields: {
        conversations: {
          merge(existing, incoming) {
            return incoming;
          }
        },
        messages: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      }
    },
    Conversation: {
      fields: {
        participant: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      }
    }
  }
});

const client = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
});

export default client;
