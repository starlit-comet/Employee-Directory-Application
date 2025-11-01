import { ObjectId } from "mongodb";
import { getDb } from "./connection.js";

const employeeOperations = {
    async getAll(limit = 10, offset = 0) {
        const db = getDb();

        // Get total count
        const totalCount = await db.collection('employees').countDocuments();

        // Use aggregation to populate department data from companyDepartment collection with pagination
        const employees = await db.collection('employees').aggregate([
            {
                $lookup: {
                    from: 'companyDepartment',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: {
                    path: '$department',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    departmentName: { $ifNull: ['$department.name', 'NO name'] }
                }
            },
            {
                $skip: offset
            },
            {
                $limit: limit
            }
        ]).toArray();

        const mappedEmployees = employees.map(emp => ({
            id: emp._id.toString(),
            name: emp.name,
            position: emp.position,
            department: {
                id: emp.department?._id?.toString() || '',
                name: emp.departmentName
            },
            viewCount:emp.viewCount
        }));
        return {
            employees: mappedEmployees,
            totalCount: totalCount,
            hasMore: (offset + limit) < totalCount
        };
    },

    async getById(id) {
        try {
            const db = getDb();

            // Use aggregation to populate department data
            const employees = await db.collection('employees').aggregate([
                {
                    $match: { _id: new ObjectId(id) }
                },
                {
                    $lookup: {
                        from: 'companyDepartment',
                        localField: 'departmentId',
                        foreignField: '_id',
                        as: 'department'
                    }
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]).toArray();
            if (employees.length > 0) {
                const employee = employees[0];
                return {
                    id: employee._id.toString(),
                    name: employee.name,
                    position: employee.position,
                    department: employee.department || {},
                    salary: employee.salary,
                    viewCount : employee.viewCount
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

        // First find the department ID by name
        const departmentDoc = await db.collection('companyDepartment').findOne({ name: department });
        if (!departmentDoc) {
            return [];
        }

        // Use aggregation to populate department data
        const employees = await db.collection('employees').aggregate([
            {
                $match: { departmentId: departmentDoc._id }
            },
            {
                $lookup: {
                    from: 'companyDepartment',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: {
                    path: '$department',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).toArray();

        return employees.map(emp => ({
            id: emp._id.toString(),
            name: emp.name,
            position: emp.position,
            department: emp.department?.name || '',
            salary: emp.salary,
            viewCount:emp.viewCount
        }));
    },

    async create(employeeData) {
        const db = getDb();

        // If department is provided as a name, find the department ID
        if (employeeData.department && !employeeData.departmentId) {
            const departmentDoc = await db.collection('companyDepartment').findOne({ name: employeeData.department });
            if (departmentDoc) {
                employeeData.departmentId = departmentDoc._id;
            }
            delete employeeData.department;
        }

        const result = await db.collection('employees').insertOne(employeeData);

        // Fetch the created employee with populated data
        const employees = await db.collection('employees').aggregate([
            {
                $match: { _id: result.insertedId }
            },
            {
                $lookup: {
                    from: 'companyDepartment',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: {
                    path: '$department',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).toArray();

        const newEmployee = employees[0];

        return {
            id: newEmployee._id.toString(),
            name: newEmployee.name,
            position: newEmployee.position,
            department: newEmployee.department?.name || '',
            salary: newEmployee.salary,
             viewCount:newEmployee.viewCount

        };
    },
    async getCount() {

    },
    async incrementViewCount(employeeId) {
        const db = getDb();
        const _id = new ObjectId(employeeId);
        await db.collection('employees').updateOne({ _id }, { $inc: { viewCount: 1 } });
        return this.getById(employeeId);
    },
};

const departmentOperations = {
    async getAll() {
        const db = getDb();
        const departments = await db.collection('companyDepartment').find({}).toArray();
        return departments.map(dept => ({
            id: dept._id.toString(),
            name: dept.name,
            floor: dept.floor
        }));

    },
    async getAllDepartments() {
        const db = getDb();
        const departments = await db.collection('companyDepartment').find({}).toArray();
        return departments.map(dept => ({
            id: dept._id.toString(),
            name: dept.name,
            floor: dept.floor
        }));

    },

    async getById(id) {
        try {
            const db = getDb();
            const department = await db.collection('companyDepartment').findOne({ _id: new ObjectId(id) });
            if (department) {
                return {
                    id: department._id.toString(),
                    name: department.name,
                    floor: department.floor
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting department by ID:', error);
            return null;
        }
    },

    async create(departmentData) {
        const db = getDb();
        const result = await db.collection('companyDepartment').insertOne(departmentData);
        const newDepartment = await db.collection('companyDepartment').findOne({ _id: result.insertedId });
        return {
            id: newDepartment._id.toString(),
            name: newDepartment.name,
            floor: newDepartment.floor
        };
    }
};

export { employeeOperations, departmentOperations };

