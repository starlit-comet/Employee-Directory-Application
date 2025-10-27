// GraphQL Types
export interface DepartmentBasic {
  id: string;
  name: string;
}

export interface CompanyBasic {
  id: string;
  name: string;
}

export interface EmployeeBasic {
  id: string;
  name: string;
  position: string;
  department: DepartmentBasic;
  company: CompanyBasic;
}

export interface Department {
  id: string;
  name: string;
  floor: string;
  description: string;
  company: CompanyBasic;
  employees?: EmployeeBasic[];
  employeeCount?: number;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  departments?: Department[];
  employees?: EmployeeBasic[];
  employeeCount?: number;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  email: string;
  phone: string;
  hireDate: string;
  department: Department;
  company: Company;
}

// GraphQL Response Types
export interface GetAllEmployeesResponse {
  getAllEmployees: EmployeeBasic[];
}

export interface GetEmployeeDetailsResponse {
  getEmployeeDetails: Employee;
}

export interface GetEmployeesByDepartmentResponse {
  getEmployeesByDepartment: Employee[];
}

export interface GetEmployeesByCompanyResponse {
  getEmployeesByCompany: Employee[];
}

export interface GetCompaniesResponse {
  getCompanies: Company[];
}

export interface GetCompanyResponse {
  getCompany: Company;
}

export interface GetDepartmentsResponse {
  getDepartments: Department[];
}

export interface GetDepartmentResponse {
  getDepartment: Department;
}

// Table sorting and filtering types
export type SortField = 'name' | 'position' | 'salary' | 'department' | 'company' | 'email' | 'phone' | 'hireDate';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  search: string;
  department: string;
  company: string;
  minSalary: number | null;
  maxSalary: number | null;
}
