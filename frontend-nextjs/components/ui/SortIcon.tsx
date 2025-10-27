interface SortIconProps {
  currentField?: string;
  sortField: string;
  direction: 'asc' | 'desc';
}

export default function SortIcon({ currentField, sortField, direction }: SortIconProps) {
  if (currentField !== sortField) {
    return <span className="text-gray-400">↕</span>;
  }
  
  return direction === 'asc' 
    ? <span className="text-blue-600">↑</span> 
    : <span className="text-blue-600">↓</span>;
}

