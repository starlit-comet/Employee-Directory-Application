export const typeDefs = `
    type Query {
        getAllEmployees: [EmployeeBasic]
        getEmployeeDetails(id: ID!): Employee
        getEmployeesByDepartment(department: String!): [Employee]
        getCompanies: [CompanyDepartment]
        getCompany(id: ID!): CompanyDepartment
    }
    
    type Employee {
        id: ID
        name: String
        position: String
        department: String
        salary: Float
    }
    
    type EmployeeBasic {
        id: ID
        name: String
        position: String
    }
    
    type CompanyDepartment {
        id: ID
        name: String
        floor: String
    }
    
    type Mutation {
        addEmployee(name: String!, position: String!, department: String!, salary: Float!): Employee
        createCompany(name: String!, floor: String!): CompanyDepartment
    }
`;

