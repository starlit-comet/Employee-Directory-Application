import { useState,useEffect } from "react";
import { GET_COMPANY_DEPARTMENTS_COUNT } from "@/lib/queries";
import client from "@/lib/apollo-client";
const DepartmentStats = ()=>{
    const [departmentCount, setDepartmentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentCount = async () => {
      try {
        const result = await client.query<any>({
          query: GET_COMPANY_DEPARTMENTS_COUNT,
          fetchPolicy: 'cache-first',
        });
        const count = result.data?.getCompanies?.length || 0;
        setDepartmentCount(count);
      } catch (error) {
        console.error('Error fetching department count:', error);
        setDepartmentCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentCount();
  }, []);

  return(
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <span className="animate-pulse bg-gray-200 h-8 w-8 rounded"></span>
                  ) : (
                    departmentCount
                  )}
                </p>
              </div>
            </div>
          </div>
  )
}

export default DepartmentStats