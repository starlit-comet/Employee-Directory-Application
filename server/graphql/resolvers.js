import { employeeOperations, departmentOperations } from "../db/operations.js";

export const resolvers = {
    Query: {
        getAllEmployees: async (parent, args) => {
            return await employeeOperations.getAll(args.limit || 10, args.offset || 0);
        },
        getEmployeeDetails: async (parent, args) => {
            return await employeeOperations.getById(args.id);
        },
        getCompanies: async () => {
            return await departmentOperations.getAll();
        },
        getAllDepartments: async (parent, args) => {
            return await departmentOperations.getAllDepartments()
        },
    },
    Mutation: {
        addEmployee: async (parent, args) => {
            const employeeData = {
                name: args.name,
                position: args.position,
                departmentId: args.departmentId,
                salary: args.salary,
             viewCount:0

            };
            return await employeeOperations.create(employeeData);
        },
        createCompany: async (parent, args) => {
            const companyData = {
                name: args.name,
                floor: args.floor,
            };
            return await departmentOperations.create(companyData);
        },
        incrementEmployeeViewCount: async (parent, args) => {
            return await employeeOperations.incrementViewCount(args.id);
        },
    },
};

