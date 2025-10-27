import { ObjectId } from "mongodb";
import { getDb } from "./connection.js";

const employeeOperations = {
    async getAll() {
        const db = getDb();
        const employees = await db.collection('employees').find({}).toArray();
        return employees.map(emp => ({
            id: emp._id.toString(),
            name: emp.name,
            position: emp.position
        }));
    },

    async getById(id) {
        try {
            const db = getDb();
            const employee = await db.collection('employees').findOne({ _id: new ObjectId(id) });
            if (employee) {
                return {
                    id: employee._id.toString(),
                    name: employee.name,
                    position: employee.position,
                    department: employee.department,
                    salary: employee.salary
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting employee by ID:', error);
            return null;
        }
    },

    async getByDepartment(department) {
        const db = getDb();
        const employees = await db.collection('employees').find({ department }).toArray();
        return employees.map(emp => ({
            id: emp._id.toString(),
            name: emp.name,
            position: emp.position,
            department: emp.department,
            salary: emp.salary
        }));
    },

    async create(employeeData) {
        const db = getDb();
        const result = await db.collection('employees').insertOne(employeeData);
        const newEmployee = await db.collection('employees').findOne({ _id: result.insertedId });
        return {
            id: newEmployee._id.toString(),
            name: newEmployee.name,
            position: newEmployee.position,
            department: newEmployee.department,
            salary: newEmployee.salary
        };
    }
};

const companyOperations = {
    async getAll() {
        const db = getDb();
        const companies = await db.collection('companies').find({}).toArray();
        return companies.map(comp => ({
            id: comp._id.toString(),
            name: comp.name,
            floor: comp.floor
        }));
    },

    async getById(id) {
        try {
            const db = getDb();
            const company = await db.collection('companies').findOne({ _id: new ObjectId(id) });
            if (company) {
                return {
                    id: company._id.toString(),
                    name: company.name,
                    floor: company.floor
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting company by ID:', error);
            return null;
        }
    },

    async create(companyData) {
        const db = getDb();
        const result = await db.collection('companies').insertOne(companyData);
        const newCompany = await db.collection('companies').findOne({ _id: result.insertedId });
        return {
            id: newCompany._id.toString(),
            name: newCompany.name,
            floor: newCompany.floor
        };
    }
};

export { employeeOperations, companyOperations };

