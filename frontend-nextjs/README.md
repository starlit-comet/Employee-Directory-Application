# SpaceAI Company Frontend

A Next.js frontend application that displays employee data from a GraphQL API.

## Features

- **Employee List**: Displays all employees in a clean table format (name + position)
- **GraphQL Integration**: Uses Apollo Client to fetch data from the GraphQL server
- **Responsive Design**: Built with Tailwind CSS for mobile-friendly interface
- **Real-time Data**: Automatically fetches fresh data from the backend

## Prerequisites

1. **GraphQL Server**: Make sure the GraphQL server is running on `http://localhost:3489`
2. **MongoDB**: Ensure MongoDB is running and contains employee data

## Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   Or use the batch file (Windows):
   ```bash
   start-dev.bat
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
frontend-nextjs/
├── app/
│   ├── layout.tsx          # Root layout with Apollo Provider
│   ├── page.tsx            # Home page with employee list
│   ├── globals.css         # Global styles
│   └── ApolloWrapper.tsx   # Apollo Client provider wrapper
├── components/
│   └── EmployeeList.tsx    # Employee list component
├── lib/
│   ├── apollo-client.ts    # Apollo Client configuration
│   └── queries.ts          # GraphQL queries and mutations
└── public/                 # Static assets (cleaned up)
```

## GraphQL Operations

The frontend uses the following GraphQL operations:

- `getAllEmployees` - Fetches employee names and positions
- `getEmployeeDetails` - Fetches complete employee information
- `getEmployeesByDepartment` - Fetches employees by department
- `addEmployee` - Adds new employee (for future use)

## Technologies Used

- **Next.js 16** - React framework
- **Apollo Client** - GraphQL client
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Development

The application automatically connects to the GraphQL server at `http://localhost:3489`. Make sure both servers are running for the application to work properly.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint