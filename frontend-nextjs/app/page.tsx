"use client";

import { useState, useEffect } from "react";
import client from "../lib/apollo-client";
import { GET_COMPANY_DEPARTMENTS_COUNT } from "../lib/queries";
import EmployeeList from "../components/EmployeeList";
import EmployeeStats from "../components/ui/EmployeeStats";
import DepartmentStats from "@/components/ui/DepartmentStats";

export default function Home() {
  const [departmentCount, setDepartmentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentCount = async () => {
      try {
        const result = await client.query<any>({
          query: GET_COMPANY_DEPARTMENTS_COUNT,
          fetchPolicy: "cache-first",
        });
        const count = result.data?.getCompanies?.length || 0;
        setDepartmentCount(count);
      } catch (error) {
        console.error("Error fetching department count:", error);
        setDepartmentCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentCount();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Advanced Employee Management System
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Powered by GraphQL & MongoDB
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">
                  🚀 Modern Technology
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">
                  ⚡ Real-time Data
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">
                  🔒 Secure & Fast
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <EmployeeStats />

          <DepartmentStats />
        </div>

        {/* Employee List */}
        <EmployeeList />
      </div>
    </div>
  );
}
