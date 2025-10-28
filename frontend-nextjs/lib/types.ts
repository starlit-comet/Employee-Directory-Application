
export interface Department {
  id: string;
  name: string;
  floor: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
 
  department: Department; 
}

// GraphQL Response Types

export interface EmployeePaginatedData {
  employees: Employee[];
  totalCount: number;
  hasMore: boolean;
}

export interface GetAllEmployeesResponse {
  getAllEmployees: EmployeePaginatedData;
}
export interface GetAllEmployeesCount{
  getCount : number
}

export interface GetEmployeeDetailsResponse {
  getEmployeeDetails: Employee;
}
export interface GetAllCompanyDepartments {
  getAllDepartments : Department[]
}

export interface GetDepartmentsResponse {
  getAllDepartments: Department;
}

// Sorting & Filtering

export type SortField = 'name' | 'position' | 'salary' | 'department';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  search: string;
  department: string;
  minSalary: number | null;
  maxSalary: number | null;
}

