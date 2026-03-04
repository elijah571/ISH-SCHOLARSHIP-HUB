import React from 'react';
import { Input, Select } from '../Input';

const PageHeader = ({ search, setSearch, sortBy, setSortBy }) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'deadline', label: 'Deadline Soon' },
    { value: 'amount', label: 'Highest Amount' },
    { value: 'name', label: 'Alphabetical' }
  ];
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left Content */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Scholarships Listing
        </h1>
        <p className="text-gray-600 mt-2">
          Explore 2,450 active opportunities matching your profile.
        </p>
      </div>

      {/* Right Content */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            type="text"
            placeholder="Search scholarships..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>

        {/* Sort Dropdown */}
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-40"
        />
      </div>
    </div>
  );
};

export default PageHeader;