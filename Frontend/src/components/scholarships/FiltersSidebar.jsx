import React from 'react';
import Button from '../Button';

const FiltersSidebar = ({ filters, onFilterChange, onResetFilters }) => {
  const fundingTypes = [
    { id: '', label: 'All Types' },
    { id: 'fully-funded', label: 'Fully Funded' },
    { id: 'partially-funded', label: 'Partial Funding' },
    { id: 'self-funded', label: 'Self-Funded' },
  ];

  const popularCountries = [
    { id: '', label: 'All Countries' },
    { id: 'United States', label: 'United States' },
    { id: 'United Kingdom', label: 'United Kingdom' },
    { id: 'Canada', label: 'Canada' },
    { id: 'Australia', label: 'Australia' },
    { id: 'Germany', label: 'Germany' },
    { id: 'France', label: 'France' },
    { id: 'Netherlands', label: 'Netherlands' },
    { id: 'Japan', label: 'Japan' },
    { id: 'Singapore', label: 'Singapore' },
  ];

  const hasActiveFilters = filters.country || filters.funding_type;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Country</h4>
        <select
          value={filters.country}
          onChange={(e) => onFilterChange('country', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white text-sm"
        >
          {popularCountries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Funding Type</h4>
        <div className="space-y-2">
          {fundingTypes.map((type) => (
            <label key={type.id} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="funding_type"
                value={type.id}
                checked={filters.funding_type === type.id}
                onChange={(e) => onFilterChange('funding_type', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2.5 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Application Status</h4>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2.5 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              Open for Applications
            </span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2.5 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              Deadline Approaching
            </span>
          </label>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mt-6">
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
