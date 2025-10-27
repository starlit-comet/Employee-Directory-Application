import { SortIcon } from './SortIcon';

interface SortableHeaderProps<T = string> {
  field: T;
  currentField?: T;
  direction: 'asc' | 'desc';
  onSort: (field: T) => void;
  children: React.ReactNode;
}

export default function SortableHeader<T = string>({ field, currentField, direction, onSort, children }: SortableHeaderProps<T>) {
  const handleClick = () => {
    onSort(field);
  };

  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <SortIcon currentField={currentField?.toString()} sortField={field?.toString()} direction={direction} />
      </div>
    </th>
  );
}

