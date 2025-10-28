import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import{GraphQl_Link} from '../app/constants/Url'
const httpLink = createHttpLink({
  uri: GraphQl_Link,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getAllEmployees: {
            merge: false, // Replace existing data instead of merging
          },
          getEmployeesByDepartment: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});

export default client;
