import { MongoClient } from "mongodb";

let db;
let client;

export const connectToMongoDB = async () => {
    try {
        client = new MongoClient('mongodb://127.0.0.1:27017');
        await client.connect();
        db = client.db('spaceai_company');
        console.log('Connected to MongoDB successfully');
        
        // Initialize with sample data if collections are empty
        await initializeSampleData();
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export const getDb = () => db;

export const closeMongoDB = async () => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
};

// Initialize sample data
const initializeSampleData = async () => {
    try {
        // Check if employees collection is empty
        const employeeCount = await db.collection('employees').countDocuments();
        if (employeeCount === 0) {
            const sampleEmployees = [
                {
                    name: "John Doe",
                    position: "Software Engineer",
                    department: "Engineering",
                    salary: 100000,
                },
                {
                    name: "Jane Smith",
                    position: "Product Manager",
                    department: "Product",
                    salary: 120000,
                },
                {
                    name: "Mike Johnson",
                    position: "Senior Developer",
                    department: "Engineering",
                    salary: 130000,
                },
                {
                    name: "Sarah Wilson",
                    position: "HR Manager",
                    department: "Human Resources",
                    salary: 90000,
                },
                {
                    name: "David Brown",
                    position: "Marketing Specialist",
                    department: "Marketing",
                    salary: 75000,
                }
            ];
            await db.collection('employees').insertMany(sampleEmployees);
            console.log('Sample employees data initialized');
        }

        // Check if companies collection is empty
        const companyCount = await db.collection('companies').countDocuments();
        if (companyCount === 0) {
            const sampleCompanies = [
                {
                    name: "Engineering",
                    floor: "2",
                },
                {
                    name: "Product",
                    floor: "3",
                },
                {
                    name: "Human Resources",
                    floor: "1",
                },
                {
                    name: "Marketing",
                    floor: "4",
                }
            ];
            await db.collection('companies').insertMany(sampleCompanies);
            console.log('Sample companies data initialized');
        }
    } catch (error) {
        console.error('Error initializing sample data:', error);
    }
};

