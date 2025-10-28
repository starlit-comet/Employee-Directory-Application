import  Avatar  from './Avatar';
import  Badge  from './Badge';
import  ActionButtons  from './ActionButtons';
import { Employee } from '../../lib/types';

interface EmployeeRowProps {
  employee: Employee;
}

export default function EmployeeRow({ employee }: EmployeeRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Avatar name={employee.name} />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
            <div className="text-sm text-gray-500">{employee.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{employee.position}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant="primary">
          {employee?.department?.name || 'NO name'}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{employee?.department?.name || 'NO name'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <ActionButtons 
          onView={() => console.log('View', employee.id)}
          onEdit={() => console.log('Edit', employee.id)}
          onDelete={() => console.log('Delete', employee.id)}
        />
      </td>
    </tr>
  );
}

