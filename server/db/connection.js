


import { MongoClient, ObjectId } from "mongodb";


let db;
let client;

export const connectToMongoDB = async () => {
    try {
        client = new MongoClient(process.env.MONGO_URI_ATLAS);
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
                    viewCount:0
                },
                {
                    name: "Jane Smith",
                    position: "Product Manager",
                    departmentId: departmentsMap.get("Product"),
                    salary: 120000,
                    viewCount:0

                },
                {
                    name: "Mike Johnson",
                    position: "Senior Developer",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 130000,
                                        viewCount:0

                },
                {
                    name: "Sarah Wilson",
                    position: "HR Manager",
                    departmentId: departmentsMap.get("Human Resources"),
                    salary: 90000,
                                        viewCount:0

                },
                {
                    name: "David Brown",
                    position: "Marketing Specialist",
                    departmentId: departmentsMap.get("Marketing"),
                    salary: 75000,
                                        viewCount:0

                },
                {
                    name: "Emily Chen",
                    position: "Data Scientist",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 115000,
                                        viewCount:0

                },
                {
                    name: "Robert Taylor",
                    position: "Sales Director",
                    departmentId: departmentsMap.get("Sales"),
                    salary: 140000,
                                        viewCount:0

                },
                {
                    name: "Lisa Anderson",
                    position: "Financial Analyst",
                    departmentId: departmentsMap.get("Finance"),
                    salary: 85000,
                                        viewCount:0

                },
                {
                    name: "James Martinez",
                    position: "DevOps Engineer",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 110000,
                                        viewCount:0

                },
                {
                    name: "Amy Williams",
                    position: "Content Manager",
                    departmentId: departmentsMap.get("Marketing"),
                    salary: 70000,
                                        viewCount:0

                },
                {
                    name: "Chris Thompson",
                    position: "Operations Manager",
                    departmentId: departmentsMap.get("Operations"),
                    salary: 95000,
                                        viewCount:0

                },
                {
                    name: "Maria Garcia",
                    position: "Legal Counsel",
                    departmentId: departmentsMap.get("Legal"),
                    salary: 125000,
                                        viewCount:0

                },
                {
                    name: "Kevin Lee",
                    position: "Frontend Developer",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 95000,
                                        viewCount:0

                },
                {
                    name: "Jennifer Davis",
                    position: "Sales Representative",
                    departmentId: departmentsMap.get("Sales"),
                    salary: 65000,
                                        viewCount:0

                },
                {
                    name: "Michael Harris",
                    position: "Accountant",
                    departmentId: departmentsMap.get("Finance"),
                    salary: 72000,
                                        viewCount:0

                },
                {
                    name: "Rachel White",
                    position: "UX Designer",
                    departmentId: departmentsMap.get("Product"),
                    salary: 88000,
                                        viewCount:0

                },
                {
                    name: "Daniel Jackson",
                    position: "Backend Developer",
                    departmentId: departmentsMap.get("Engineering"),
                    salary: 105000,
                                        viewCount:0

                },
                {
                    name: "Jessica Martinez",
                    position: "Talent Acquisition",
                    departmentId: departmentsMap.get("Human Resources"),
                    salary: 68000,
                                        viewCount:0

                },
                {
                    name: "Andrew Kim",
                    position: "Marketing Manager",
                    departmentId: departmentsMap.get("Marketing"),
                    salary: 92000,
                                        viewCount:0

                },
                {
                    name: "Lauren Brown",
                    position: "Legal Assistant",
                    departmentId: departmentsMap.get("Legal"),
                    salary: 55000,
                                        viewCount:0

                },
            ];

            await db.collection("employees").insertMany(sampleEmployees);
            console.log("Sample employees data initialized (linked to departments)");
        }
    } catch (error) {
        console.error("Error initializing sample data:", error);
    }
};
