import { employeeOperations, companyOperations } from "../db/operations.js";

export const resolvers = {
    Query: {
        getAllEmployees: async () => {
            return await employeeOperations.getAll();
        },
        getEmployeeDetails: async (parent, args) => {
            return await employeeOperations.getById(args.id);
        },
        getEmployeesByDepartment: async (parent, args) => {
            return await employeeOperations.getByDepartment(args.department);
        },
        getCompanies: async () => {
            return await companyOperations.getAll();
        },
        getCompany: async (parent, args) => {
            return await companyOperations.getById(args.id);
        },
    },
    Mutation: {
        addEmployee: async (parent, args) => {
            const employeeData = {
                name: args.name,
                position: args.position,
                department: args.department,
                salary: args.salary,
            };
            return await employeeOperations.create(employeeData);
        },
        createCompany: async (parent, args) => {
            const companyData = {
                name: args.name,
                floor: args.floor,
            };
            return await companyOperations.create(companyData);
        },
    },
};

