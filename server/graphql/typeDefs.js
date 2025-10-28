export const typeDefs = `
    type Query {
        getAllEmployees(limit: Int = 10, offset: Int = 0): EmployeePaginated
        getEmployeeDetails(id: ID!): Employee
        getEmployeesByDepartment(department: String!): [Employee]
        getCompanies: [Department]
        getCompany(id: ID!): Department
        getAllDepartments: [Department]
        getAll:[Department]
    }
    
    type EmployeePaginated {
        employees: [Employee]
        totalCount: Int
        hasMore: Boolean
    }
    
    type Employee {
        id: ID
        name: String
        position: String
        department: Department
        departmentId:String
        salary: Float
    }
    
   
  
    
    type Department {
        id: String
        name: String
        floor: String
    }
    
    type Mutation {
        addEmployee(name: String!, position: String!, departmentId: String!, salary: Float!): Employee
        createCompany(name: String!, floor: String!): Department
    }
`;

