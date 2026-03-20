import React from 'react';
import Button from '../Button';

const InternshipFiltersSidebar = ({ filters, onFilterChange, onResetFilters }) => {
  const locations = [
    { id: 'all', label: 'All Locations' },
    { id: 'remote', label: 'Remote' },
    { id: 'us', label: 'United States' },
    { id: 'europe', label: 'Europe' },
    { id: 'asia', label: 'Asia Pacific' }
  ];

  const durations = [
    { id: 'all', label: 'Any Duration' },
    { id: 'short', label: 'Under 3 months' },
    { id: 'medium', label: '3-6 months' },
    { id: 'long', label: '6+ months' }
  ];

  const types = [
    { id: 'paid', label: 'Paid' },
    { id: 'stipend', label: 'Stipend' },
    { id: 'unpaid', label: 'Unpaid' }
  ];

  const industries = [
    { id: 'tech', label: 'Technology' },
    { id: 'finance', label: 'Finance' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'research', label: 'Research' }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onResetFilters}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          Reset All
        </button>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Location</h4>
        <div className="space-y-3">
          {locations.map((location) => (
            <label key={location.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="location"
                value={location.id}
                checked={filters.location === location.id}
                onChange={(e) => onFilterChange('location', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{location.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Duration</h4>
        <div className="space-y-3">
          {durations.map((duration) => (
            <label key={duration.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="duration"
                value={duration.id}
                checked={filters.duration === duration.id}
                onChange={(e) => onFilterChange('duration', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{duration.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Type</h4>
        <div className="space-y-3">
          {types.map((type) => (
            <label key={type.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="type"
                value={type.id}
                checked={filters.type === type.id}
                onChange={(e) => onFilterChange('type', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Industry</h4>
        <div className="space-y-3">
          {industries.map((industry) => (
            <label key={industry.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="industry"
                value={industry.id}
                checked={filters.industry === industry.id}
                onChange={(e) => onFilterChange('industry', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{industry.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full mb-4">
        Show More Filters
      </Button>

      <div className="bg-emerald-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          Need Career Guidance?
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          Our career coaches can help you find the perfect internship match.
        </p>
        <Button className="w-full" size="sm">
          Book Session
        </Button>
      </div>
    </div>
  );
};

export default InternshipFiltersSidebar;
