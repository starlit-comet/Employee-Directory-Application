import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connectToMongoDB } from "./db/connection.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import { PORT } from "./Constants/URLs.js";
// Start server
const startServer = async () => {
    // Connect to MongoDB first
    await connectToMongoDB();
    
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: PORT },
    });

    console.log(`GraphQL Server is running on ${url}`);
    console.log('MongoDB database: spaceai_company');
    console.log('Collections: employees, companies');
};

startServer().catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
});