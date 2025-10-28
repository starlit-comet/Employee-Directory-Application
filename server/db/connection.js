


import { MongoClient, ObjectId } from "mongodb";
import { MONGO_URI } from "../Constants/URLs.js";

let db;
let client;

export const connectToMongoDB = async () => {
    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db("spaceai_company");
        console.log("Connected to MongoDB successfully");

        // Initialize with sample data if collections are empty
        await initializeSampleData();
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export const getDb = () => db;

export const closeMongoDB = async () => {
    if (client) {
        await client.close();
        console.log("MongoDB connection closed");
    }
};

// Initialize sample data with department linkage
const initializeSampleData = async () => {
    try {
        // Check if companyDepartment collection is empty
        const departmentCount = await db.collection("companyDepartment").countDocuments();
        let departmentsMap = new Map();

        if (departmentCount === 0) {
            const sampleDepartments = [
                { name: "Engineering", floor: '2' },
                { name: "Product", floor: '3' },
                { name: "Human Resources", floor: '1' },
                { name: "Marketing", floor: '4' },
                { name: "Sales", floor: '5' },
                { name: "Finance", floor: '2' },
                { name: "Operations", floor: '3' },
                { name: "Legal", floor: '1' },
            ];

            const { insertedIds } = await db.collection("companyDepartment").insertMany(sampleDepartments);
            console.log("Sample departments data initialized");

            // Create a name-to-ObjectId map for later linking
            Object.values(insertedIds).forEach((id, index) => {
                const name = sampleDepartments[index].name;
                departmentsMap.set(name, id);
            });
        } else {
            // If already exists, get the map from existing data
            const existingDepartments = await db.collection("companyDepartment").find().toArray();
            existingDepartments.forEach((dept) => {
                departmentsMap.set(dept.name, dept._id);
            });
        }

        // Check if employees collection is empty
        const employeeCount = await db.collection("employees").countDocuments();
        if (employeeCount === 0) {
            const sampleEmployees = [
                {
                    name: "John Doe",
                    position: "Software Engineer",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 100000,
                },
                {
                    name: "Jane Smith",
                    position: "Product Manager",
                    departmentId: departmentsMap.get("Product"),
                    salary: 120000,
                },
                {
                    name: "Mike Johnson",
                    position: "Senior Developer",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 130000,
                },
                {
                    name: "Sarah Wilson",
                    position: "HR Manager",
                    departmentId: departmentsMap.get("Human Resources"),
                    salary: 90000,
                },
                {
                    name: "David Brown",
                    position: "Marketing Specialist",
                    departmentId: departmentsMap.get("Marketing"),
                    salary: 75000,
                },
                {
                    name: "Emily Chen",
                    position: "Data Scientist",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 115000,
                },
                {
                    name: "Robert Taylor",
                    position: "Sales Director",
                    departmentId: departmentsMap.get("Sales"),
                    salary: 140000,
                },
                {
                    name: "Lisa Anderson",
                    position: "Financial Analyst",
                    departmentId: departmentsMap.get("Finance"),
                    salary: 85000,
                },
                {
                    name: "James Martinez",
                    position: "DevOps Engineer",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 110000,
                },
                {
                    name: "Amy Williams",
                    position: "Content Manager",
                    departmentId: departmentsMap.get("Marketing"),
                    salary: 70000,
                },
                {
                    name: "Chris Thompson",
                    position: "Operations Manager",
                    departmentId: departmentsMap.get("Operations"),
                    salary: 95000,
                },
                {
                    name: "Maria Garcia",
                    position: "Legal Counsel",
                    departmentId: departmentsMap.get("Legal"),
                    salary: 125000,
                },
                {
                    name: "Kevin Lee",
                    position: "Frontend Developer",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 95000,
                },
                {
                    name: "Jennifer Davis",
                    position: "Sales Representative",
                    departmentId: departmentsMap.get("Sales"),
                    salary: 65000,
                },
                {
                    name: "Michael Harris",
                    position: "Accountant",
                    departmentId: departmentsMap.get("Finance"),
                    salary: 72000,
                },
                {
                    name: "Rachel White",
                    position: "UX Designer",
                    departmentId: departmentsMap.get("Product"),
                    salary: 88000,
                },
                {
                    name: "Daniel Jackson",
                    position: "Backend Developer",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 105000,
                },
                {
                    name: "Jessica Martinez",
                    position: "Talent Acquisition",
                    departmentId: departmentsMap.get("Human Resources"),
                    salary: 68000,
                },
                {
                    name: "Andrew Kim",
                    position: "Marketing Manager",
                    departmentId: departmentsMap.get("Marketing"),
                    salary: 92000,
                },
                {
                    name: "Lauren Brown",
                    position: "Legal Assistant",
                    departmentId: departmentsMap.get("Legal"),
                    salary: 55000,
                },
            ];

            await db.collection("employees").insertMany(sampleEmployees);
            console.log("Sample employees data initialized (linked to departments)");
        }
    } catch (error) {
        console.error("Error initializing sample data:", error);
    }
};
