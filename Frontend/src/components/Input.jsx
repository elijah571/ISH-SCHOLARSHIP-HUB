import React from 'react';

export const Input = ({ 
  type = 'text', 
  placeholder = '', 
  className = '', 
  label,
  error,
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export const Select = ({ 
  options = [], 
  placeholder = 'Select option', 
  className = '', 
  label,
  error,
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default { Input, Select };
