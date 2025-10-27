# Reusable UI Components

This directory contains reusable UI components that can be used throughout the application.

## Components

### **Button** (`Button.tsx`)
A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- Standard HTML button props

**Usage:**
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### **Input** (`Input.tsx`)
A text input component with optional label.

**Props:**
- `label`: string
- Standard HTML input props

**Usage:**
```tsx
<Input label="Name" type="text" placeholder="Enter name" />
```

### **Select** (`Select.tsx`)
A dropdown select component.

**Props:**
- `label`: string
- `options`: Array of `{ value: string, label: string }`
- Standard HTML select props

**Usage:**
```tsx
<Select 
  label="Category" 
  options={[{ value: '1', label: 'Option 1' }]} 
/>
```

### **Badge** (`Badge.tsx`)
A colored badge component for displaying status or tags.

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
- `children`: ReactNode

**Usage:**
```tsx
<Badge variant="primary">Active</Badge>
```

### **Card Components** (`Card.tsx`)
Card wrapper components for consistent card layouts.

**Components:**
- `Card`: Main wrapper
- `CardHeader`: Header section
- `CardBody`: Body section
- `CardFooter`: Footer section

**Usage:**
```tsx
<Card>
  <CardHeader>Header</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

### **Avatar** (`Avatar.tsx`)
Display user avatar with initials.

**Props:**
- `name`: string (for initials)
- `size`: 'sm' | 'md' | 'lg'

**Usage:**
```tsx
<Avatar name="John Doe" size="md" />
```

### **SortableHeader** (`SortableHeader.tsx`)
Table header with sorting functionality.

**Props:**
- `field`: Sort field
- `currentField`: Currently sorted field
- `direction`: 'asc' | 'desc'
- `onSort`: (field) => void
- `children`: Header text

**Usage:**
```tsx
<SortableHeader
  field={'name' as SortField}
  currentField={sortConfig.field}
  direction={sortConfig.direction}
  onSort={handleSort}
>
  Name
</SortableHeader>
```

### **LoadingState** (`LoadingState.tsx`)
Loading indicator components.

**Components:**
- `EmployeeSkeleton`: Skeleton loader for employees
- `LoadingState`: Generic loading state with title

**Usage:**
```tsx
<LoadingState title="Loading..." message="Please wait" />
<EmployeeSkeleton />
```

### **ErrorState** (`ErrorState.tsx`)
Error display component.

**Props:**
- `title`: string
- `message`: string

**Usage:**
```tsx
<ErrorState title="Error" message="Something went wrong" />
```

### **EmptyState** (`EmptyState.tsx`)
Empty state component for when no data is found.

**Props:**
- `title`: string
- `message`: string
- `icon`: ReactNode (optional)

**Usage:**
```tsx
<EmptyState 
  title="No data found" 
  message="Try adjusting your filters" 
/>
```

### **ActionButtons** (`ActionButtons.tsx`)
Action button group component.

**Props:**
- `onView`: () => void
- `onEdit`: () => void
- `onDelete`: () => void

**Usage:**
```tsx
<ActionButtons 
  onView={() => console.log('view')}
  onEdit={() => console.log('edit')}
  onDelete={() => console.log('delete')}
/>
```

### **EmployeeRow** (`EmployeeRow.tsx`)
Table row component for displaying employee data.

**Props:**
- `employee`: EmployeeBasic

**Usage:**
```tsx
<EmployeeRow employee={employee} />
```

## Index Export

All components are exported from `index.ts` for easy importing:

```tsx
import { Button, Input, Card, Badge } from './ui';
```

