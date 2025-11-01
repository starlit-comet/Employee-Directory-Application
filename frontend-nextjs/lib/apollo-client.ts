import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import{GraphQl_Link} from '../app/constants/Url'
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_LINK,
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
      fetchPolicy: 'no-cache',
    },
  },
});

export default client;
