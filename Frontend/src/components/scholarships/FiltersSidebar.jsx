import React from 'react';
import Button from '../Button';

const FiltersSidebar = ({ filters, onFilterChange, onResetFilters }) => {
  const categories = [
    { id: 'academic', label: 'Academic Excellence' },
    { id: 'sports', label: 'Sports & Arts' },
    { id: 'stem', label: 'STEM Focused' }
  ];

  const levels = [
    { id: 'undergraduate', label: 'Undergraduate' },
    { id: 'postgraduate', label: 'Postgraduate' },
    { id: 'phd', label: 'PhD / Research' }
  ];

  const fundingTypes = [
    { id: 'fully-funded', label: 'Fully Funded' },
    { id: 'partial', label: 'Partial Funding' },
    { id: 'all', label: 'All Types' }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onResetFilters}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={filters.category === category.id}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Level</h4>
        <div className="space-y-3">
          {levels.map((level) => (
            <label key={level.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="level"
                value={level.id}
                checked={filters.level === level.id}
                onChange={(e) => onFilterChange('level', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{level.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Funding Type Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Funding Type</h4>
        <div className="space-y-3">
          {fundingTypes.map((type) => (
            <label key={type.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="funding"
                value={type.id}
                checked={filters.funding === type.id}
                onChange={(e) => onFilterChange('funding', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Show More Filters Button */}
      <Button variant="outline" className="w-full mb-4">
        Show More Filters
      </Button>

      {/* Help Card */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          Need Help Finding Scholarships?
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          Our experts can help you identify the best opportunities based on your profile.
        </p>
        <Button className="w-full" size="sm">
          Book Consultation
        </Button>
      </div>
    </div>
  );
};

export default FiltersSidebar;