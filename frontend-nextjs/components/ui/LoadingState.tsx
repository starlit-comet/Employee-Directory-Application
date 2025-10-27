export function EmployeeSkeleton() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-6 border-b border-gray-100">
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
}

export function LoadingState({ title = 'Loading...', message }: { title?: string; message?: string }) {
  return (
    <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {message && <p className="text-gray-600 mt-1">{message}</p>}
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}

