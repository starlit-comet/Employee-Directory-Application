export const typeDefs = `
    type Query {
        getAllEmployees(limit: Int = 10, offset: Int = 0): EmployeePaginated
        getEmployeeDetails(id: ID!): Employee
        getCompanies: [Department]
        getAllDepartments: [Department]
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
        viewCount : Int
    }
    
   
  
    
    type Department {
        id: String
        name: String
        floor: String
    }
    
    type Mutation {
        addEmployee(name: String!, position: String!, departmentId: String!, salary: Float!, viewCount : Int): Employee
        createCompany(name: String!, floor: String!): Department
        incrementEmployeeViewCount(id: ID!): Employee
        
    }
`;

