"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import client from "../../../lib/apollo-client";
import { GET_EMPLOYEE_DETAILS } from "../../../lib/queries";
import { GetEmployeeDetailsResponse } from "../../../lib/types";
import ErrorState from "../../../components/ui/ErrorState";
import Link from "next/link";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await client.query<GetEmployeeDetailsResponse>({
          query: GET_EMPLOYEE_DETAILS,
          variables: { id },
          fetchPolicy: "network-only",
        });

        setEmployee(data?.getEmployeeDetails);
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch employee details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-blue-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <ErrorState title="Error Loading Employee" message={error} />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Employee Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The employee you're looking for doesn't exist.
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Employee List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Back to Employee List
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Employee Details
                </h1>
                <p className="text-gray-600 mt-1">
                  Complete information about the employee
                </p>
              </div>
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {employee.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="text-gray-900 text-lg">{employee.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Unique Employee ID
                    </label>
                    <p className="text-gray-900 text-lg font-mono">
                      {employee.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Job Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Position
                    </label>
                    <p className="text-gray-900 text-lg">{employee.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Department
                    </label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full ml-3 text-sm font-medium bg-blue-100 text-blue-800">
                      {employee.department.name || "Not found"}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full ml-3 text-sm font-medium bg-blue-100 text-blue-800">
                      Floor: {employee.department.floor || "Not found"}
                    </span>
                  </div>
                  {employee.salary && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Salary
                      </label>
                      <p className="text-gray-900 text-lg">
                        ${employee.salary?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end space-x-4">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
