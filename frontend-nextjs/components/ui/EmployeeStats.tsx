'use client';

import { useState, useEffect } from 'react';
import client from '../../lib/apollo-client';
import { GET_ALL_EMPLOYEES } from '../../lib/queries';
import { GetAllEmployeesResponse } from '../../lib/types';

export default function EmployeeStats() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data } = await client.query<GetAllEmployeesResponse>({
          query: GET_ALL_EMPLOYEES,
          fetchPolicy: 'cache-first',
        });
        setEmployeeCount(data?.getAllEmployees?.totalCount || 0);
      } catch (error) {
        console.error('Error fetching employee count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center">
        <div className="p-3 bg-blue-100 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? (
              <span className="animate-pulse bg-gray-200 h-8 w-16 rounded"></span>
            ) : (
              employeeCount
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
