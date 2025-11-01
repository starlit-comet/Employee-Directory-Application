"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import client from "../lib/apollo-client";
// import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import { GET_ALL_DEPARTMENTS, GET_ALL_EMPLOYEES, INCREMENT_EMPLOYEE_VIEW_COUNT } from "../lib/queries";
import {
  Employee,
  GetAllEmployeesResponse,
  SortField,
  SortDirection,
  SortConfig,
  FilterConfig,
  Department,
  GetDepartmentsResponse,
  GetAllCompanyDepartments,
} from "../lib/types";
import AddEmployeeModal from "./AddEmployeeModal";
import Toast from "./ui/Toast";
import ErrorState from "./ui/ErrorState";
// import UserDataModal from "./ui/UserDataModal";

// Loading skeleton component
const EmployeeSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="flex items-center space-x-4 p-6 border-b border-gray-100"
      >
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function EmployeeList() {
  const router = useRouter();
  const [isDetailPageActive,setDetailPageActive] = useState<boolean>(false)
    const [open, setOpen] = useState(false)
  
  const [employeeData,setEmployeeData] = useState<any>({})
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyDeparment, setCompanyDeparment] = useState<Department[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "name",
    direction: "asc",
  });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    search: "",
    department: "",
    // company: '',
    minSalary: null,
    maxSalary: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: "info" | "success" | "warning" | "error";
  } | null>(null);

  const showNotification = (
    message: string,
    type: "info" | "success" | "warning" | "error" = "info"
  ) => {
    setToast({ message, type });
  };
   const handleDataOpenning = async (data: Employee) => {
    setEmployeeData(data);
    setOpen(true);
    try {
      await client.mutate({
        mutation: INCREMENT_EMPLOYEE_VIEW_COUNT,
        variables: { id: data.id },
        refetchQueries: ['GetAllEmployees'],
      });
    } catch (e) {
      console.error('Failed to increment view count', e);
    }
   };
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (currentPage - 1) * itemsPerPage;

      const { data } = await client.query<GetAllEmployeesResponse>({
        query: GET_ALL_EMPLOYEES,
        variables: {
          limit: itemsPerPage,
          offset: offset,
        },
        fetchPolicy: "network-only",
      });

      if (data?.getAllEmployees) {
        setEmployees(data.getAllEmployees.employees || []);
        setTotalCount(data.getAllEmployees.totalCount || 0);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch employees"
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchCompanyDeparment = async () => {
    try {
      const { data } = await client.query<GetAllCompanyDepartments>({
        query: GET_ALL_DEPARTMENTS,
        fetchPolicy: "no-cache",
      });
      if (data?.getAllDepartments) {
        setCompanyDeparment(data.getAllDepartments);
      }
    } catch (err) {
      console.error("Error fetching Deppartments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch departments"
      );
    }
  };

  useEffect(() => {
    fetchCompanyDeparment();
  }, []);
  useEffect(() => {
    fetchEmployees();
    // fetchCompanyDeparment();
  }, [currentPage, itemsPerPage]);

  const handleEmployeeAdded = () => {
    setCurrentPage(1); // Reset to first page when new employee is added
    fetchEmployees();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Get unique departments for filter dropdowns
  const departments = useMemo(() => {
    const deptSet = new Set(
      employees.map((emp) => emp?.department?.name || "NO name")
    );
    return Array.from(deptSet).sort();
  }, [employees]);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter((emp) => {
      // console.log(filteredAndSortedEmployees)
      const matchesSearch =
        emp.name.toLowerCase().includes(filterConfig.search.toLowerCase()) ||
        emp.position
          .toLowerCase()
          .includes(filterConfig.search.toLowerCase()) ||
        emp.department.name
          .toLowerCase()
          .includes(filterConfig.search.toLowerCase());
      const matchesDepartment =
        !filterConfig.department ||
        emp.department.name === filterConfig.department;
      return matchesSearch && matchesDepartment;
    });
    //   Sort employees
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortConfig.field) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "position":
          aValue = a.position;
          bValue = b.position;
          break;
        case "department":
          aValue = a.department.name;
          bValue = b.department.name;
          break;

        default:
          aValue = a.name;
          bValue = b.name;
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [employees, sortConfig, filterConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) {
      return <span className="text-gray-400">↕</span>;
    }
    return sortConfig.direction === "asc" ? (
      <span className="text-blue-600">↑</span>
    ) : (
      <span className="text-blue-600">↓</span>
    );
  };
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Employee Directory
              </h2>
              <p className="text-gray-600 mt-1">Loading employee data...</p>
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <EmployeeSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Error Loading Employees" message={error} />;
  }
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6  from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Employee Directory
            </h2>
            <p className="text-gray-600 mt-1">
              Complete list of company employees
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Add Employee</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 bg-gray-50 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search employees..."
              value={filterConfig.search}
              onChange={(e) =>
                setFilterConfig((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={filterConfig.department}
              onChange={(e) =>
                setFilterConfig((prev) => ({
                  ...prev,
                  department: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {companyDeparment.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() =>
                setFilterConfig({
                  search: "",
                  department: "",
                  minSalary: null,
                  maxSalary: null,
                })
              }
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredAndSortedEmployees.length === 0 ? (
        <div className="px-8 py-16 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No employees found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("position")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Position</span>
                    <SortIcon field="position" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("department")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Department</span>
                    <SortIcon field="department" />
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View Count
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        {/* <div className="text-sm text-gray-500">{employee.id}</div> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.position}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {employee?.department?.name || "NO name"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.viewCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDataOpenning(employee)}
                        className="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-black inset-ring inset-ring-white/5 hover:bg-blue-900"
                      >
                        Show details
                      </button>
                      <Dialog open={open} onClose={setOpen} className="relative z-10">
                        <DialogBackdrop
                          transition
                          className="fixed inset-0 bg-gray-100/50 transition-opacity data-closed:opacity-50 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                              transition
                              className="relative transform overflow-hidden rounded-lg bg-blue-600 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                            >
                              <div className="bg-blue-500 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 font-bold sm:mx-0 sm:size-10">
                                    {(employeeData?.name || "?")
                                      .toString()
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </div>
                                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <DialogTitle as="h3" className="text-lg font-semibold text-white">
                                      {employeeData?.name || "Employee Details"}
                                    </DialogTitle>
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <p className="text-gray-400">Position</p>
                                        <p className="text-white">{employeeData?.position ?? "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-400">Department</p>
                                        <p className="text-white">{employeeData?.department?.name ?? "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-400">View Count</p>
                                        <p className="text-white">{employeeData?.viewCount ?? 0}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-400">ID</p>
                                        <p className="text-white">{employeeData?.id ?? "-"}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                  type="button"
                                  data-autofocus
                                  onClick={() => setOpen(false)}
                                  className="inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:w-auto"
                                >
                                  Close
                                </button>
                              </div>
                            </DialogPanel>
                          </div>
                        </div>
                      </Dialog>

                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/employee/${employee.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Employee"
                      >
                      <button onClick = {} >show Details</button>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button> */}
                      
                      {/* <button onClick={()=>setDetailPageActive(true)}>Show Details</button>
                     
<div className="-z-10 relative" >user Data here</div> */}

                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showNotification(
                            "Edit employee feature is not yet implemented",
                            "info"
                          );
                        }}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        title="Edit Employee"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showNotification(
                            "Delete employee feature is not yet implemented",
                            "warning"
                          );
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete Employee"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button> */}
                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left side - Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>
              Showing {startItem}-{endItem} of {totalCount} employees
            </span>
            <span className="text-gray-300">•</span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-4">
            {/* Items per page selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-gray-700">per page</span>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="First page"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Previous page"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page number display */}
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Next page"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Last page"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleEmployeeAdded}
        departments={companyDeparment}
        showNotification={showNotification}
        setToast = { setToast}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {isDetailPageActive && (
        <div style={{zIndex:1}}className="" >

          <h2>user data here</h2>
        </div>
      )}
    </div>
  );
}
