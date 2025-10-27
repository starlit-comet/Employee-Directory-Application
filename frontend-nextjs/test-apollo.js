// Simple test script to verify Apollo Client connection
import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:3489/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      name
      position
    }
  }
`;

async function testConnection() {
  try {
    console.log('Testing Apollo Client connection...');
    const { data } = await client.query({
      query: GET_ALL_EMPLOYEES,
    });
    
    console.log('✅ Connection successful!');
    console.log('Employees:', data.getAllEmployees);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
