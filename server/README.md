# GraphQL Server with MongoDB

This GraphQL server uses MongoDB as the database for persistent data storage.

## Prerequisites

1. **MongoDB**: Make sure MongoDB is installed and running on your local machine
   - Default connection: `mongodb://localhost:27017`
   - Database name: `spaceai_company`
   - Collections: `employees`, `companies`

## Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start MongoDB service (if not already running):
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

3. Run the server:
   ```bash
   npm start
   ```

   Or use the batch file (Windows):
   ```bash
   install-and-run.bat
   ```

## GraphQL Operations

### Queries
- `getAllEmployees` - Returns name + position only
- `getEmployeeDetails(id)` - Returns all employee fields
- `getEmployeesByDepartment(department)` - Returns employees by department
- `getCompanies` - Returns all company departments
- `getCompany(id)` - Returns specific company department

### Mutations
- `addEmployee(name, position, department, salary)` - Adds new employee
- `createCompany(name, floor)` - Adds new company department

## Database Schema

### Employees Collection
```javascript
{
  _id: ObjectId,
  name: String,
  position: String,
  department: String,
  salary: Number
}
```

### Companies Collection
```javascript
{
  _id: ObjectId,
  name: String,
  floor: String
}
```

## Testing

1. Open GraphQL Playground: `http://localhost:3489`
2. Test queries and mutations
3. Check MongoDB to see persisted data

## Sample Queries

```graphql
# Get all employees (name + position only)
query {
  getAllEmployees {
    name
    position
  }
}

# Get employee details
query {
  getEmployeeDetails(id: "EMPLOYEE_ID") {
    id
    name
    position
    department
    salary
  }
}

# Get employees by department
query {
  getEmployeesByDepartment(department: "Engineering") {
    id
    name
    position
    department
    salary
  }
}

# Add new employee
mutation {
  addEmployee(
    name: "Alice Johnson"
    position: "UX Designer"
    department: "Design"
    salary: 85000
  ) {
    id
    name
    position
    department
    salary
  }
}
```
