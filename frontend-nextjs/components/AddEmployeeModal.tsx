'use client';

import { useState, useEffect } from 'react';
import client from '../lib/apollo-client';
import { ADD_EMPLOYEE } from '../lib/queries';
import { Department } from '@/lib/types';


interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departments: Department[];
   showNotification: (message: string, type?: "info" | "success" | "warning" | "error") => void;
  setToast: React.Dispatch<
    React.SetStateAction<
      { message: string; type: "info" | "success" | "warning" | "error" } | null
    >
  >;
}

interface FormData {
  name: string;
  position: string;
  departmentId: string;
  salary: string;
}

interface FieldErrors {
  name?: string;
  position?: string;
  department?: string;
  salary?: string;
}

export default function AddEmployeeModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  departments,
  setToast,
  showNotification
}: AddEmployeeModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    position: '',
    departmentId: '',
    salary: ''
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name must be less than 100 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        break;
      case 'position':
        if (!value.trim()) return 'Position is required';
        if (value.trim().length < 2) return 'Position must be at least 2 characters';
        if (value.trim().length > 100) return 'Position must be less than 100 characters';
        break;
      case 'department':
        if (!value) return 'Department is required';
        break;
      case 'salary':
        if (!value) return 'Salary is required';
        const salaryValue = parseFloat(value);
        if (isNaN(salaryValue)) return 'Salary must be a valid number';
        if (salaryValue < 0) return 'Salary cannot be negative';
        if (salaryValue < 1000) return 'Salary must be at least $1,000';
        if (salaryValue > 1000000) return 'Salary cannot exceed $1,000,000';
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field and set error
    const fieldError = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
    
    // Clear general error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    
    // Validate all fields
    const nameError = validateField('name', formData.name);
    const positionError = validateField('position', formData.position);
    const departmentError = validateField('department', formData.departmentId);
    const salaryError = validateField('salary', formData.salary);
    
    if (nameError) errors.name = nameError;
    if (positionError) errors.position = positionError;
    if (departmentError) errors.department = departmentError;
    if (salaryError) errors.salary = salaryError;
    
    setFieldErrors(errors);
    
    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent default browser validation
    const form = e.currentTarget as HTMLFormElement;
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await client.mutate({
        mutation: ADD_EMPLOYEE,
        variables: {
          name: formData.name.trim(),
          position: formData.position.trim(),
          departmentId: formData.departmentId,
          salary: parseFloat(formData.salary)
        },
        refetchQueries: ['GetAllEmployees']
      });

      // Reset form and errors
      setFormData({
        name: '',
        position: '',
        departmentId: '',
        salary: ''
      });
      setFieldErrors({});

      onSuccess();
      onClose();
      // setToast
      showNotification('New Employee added Successfully','success')
    } catch (err) {
      console.error('Error adding employee:', err);
      setError(err instanceof Error ? err.message : 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      position: '',
      departmentId: '',
      salary: ''
    });
    setFieldErrors({});
    setError(null);
    onClose();
  };

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Add New Employee</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.name 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="John Doe"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.position 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Software Engineer"
              />
              {fieldErrors.position && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.position}</p>
              )}
            </div>

            {/* Department */}
            <div>
  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
    Department <span className="text-red-500">*</span>
  </label>
  <select
    id="department"
    name="departmentId"
    value={formData.departmentId}
    onChange={handleChange}
    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
      fieldErrors.department 
        ? 'border-red-300 focus:ring-red-500' 
        : 'border-gray-300 focus:ring-blue-500'
    }`}
  >
    <option value="">Select Department</option>
    {departments.map((dept) => (
      <option key={dept.id} value={dept.id}>
        {dept.name} {'-> floor: '} {dept.floor}
      </option>
    ))}
  </select>
  {fieldErrors.department && (
    <p className="mt-1 text-sm text-red-600">{fieldErrors.department}</p>
  )}
</div>


            {/* Salary */}
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                Salary <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.salary 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="100000"
              />
              {fieldErrors.salary && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.salary}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

