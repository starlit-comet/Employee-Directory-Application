

import { gql } from '@apollo/client';

export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees($limit: Int, $offset: Int) {
    getAllEmployees(limit: $limit, offset: $offset) {
      employees {
        id
        name
        position
        salary
        department {
          id
          name
          floor
        }
      }
      totalCount
      hasMore
    }
  }
`;

export const  GET_ALL_EMPLOYEES_COUNT = gql`
  query GetAllEmployeesCount{
  getCount{
    count
  }
  }
`
export const GET_COMPANY_DEPARTMENTS_COUNT = gql`
  query GetCompanyDeparmentsCount{
  getCompanies{
    id
    name
    floor
    }
  }
`

export const GET_EMPLOYEE_DETAILS = gql`
  query GetEmployeeDetails($id: ID!) {
    getEmployeeDetails(id: $id) {
      id
      name
      position
      salary
      department {
        id
        name
        floor
      }
    }
  }
`;

export const GET_ALL_DEPARTMENTS = gql`
  query GetAllDepartments {
    getAllDepartments {
      id
      name
      floor
    }
  }
`;
export const GET_ALL = gql`
  query getAll{
  getAll{
  id
  name
  floor 
  }
  }
`

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $name: String!,
    $position: String!,
    $salary: Float!,
    $departmentId: String!
  ) {
    addEmployee(
      name: $name,
      position: $position,
      salary: $salary,
      departmentId: $departmentId
    ) {
      id
      name
      position
      salary
      departmentId
}
  }
`;

