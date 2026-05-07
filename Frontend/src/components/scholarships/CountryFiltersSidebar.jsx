import React, { useState } from 'react';
import Button from '../Button';

const filterOptions = {
  field_of_study: [
    { id: '', label: 'All Fields' },
    { id: 'Computer Science', label: 'Computer Science' },
    { id: 'Engineering', label: 'Engineering' },
    { id: 'Business', label: 'Business & Management' },
    { id: 'Medicine', label: 'Medicine & Health' },
    { id: 'Law', label: 'Law' },
    { id: 'Arts', label: 'Arts & Humanities' },
    { id: 'Social Sciences', label: 'Social Sciences' },
    { id: 'Natural Sciences', label: 'Natural Sciences' },
  ],
  location: [
    { id: '', label: 'All Locations' },
    { id: 'Urban', label: 'Urban' },
    { id: 'Suburban', label: 'Suburban' },
    { id: 'Rural', label: 'Rural' },
    { id: 'Campus', label: 'Campus-based' },
  ],
  university: [
    { id: '', label: 'All Universities' },
  ],
  tuition_fees: [
    { id: '', label: 'All Fees' },
    { id: 'Free', label: 'Free / Fully Funded' },
    { id: 'Under 5000', label: 'Under $5,000/year' },
    { id: '5000-10000', label: '$5,000 - $10,000/year' },
    { id: '10000-20000', label: '$10,000 - $20,000/year' },
    { id: 'Over 20000', label: 'Over $20,000/year' },
  ],
  duration: [
    { id: '', label: 'All Durations' },
    { id: '1 year', label: '1 Year' },
    { id: '2 years', label: '2 Years' },
    { id: '3 years', label: '3 Years' },
    { id: '4+ years', label: '4+ Years' },
  ],
  format: [
    { id: '', label: 'All Formats' },
    { id: 'Full-time', label: 'Full-time' },
    { id: 'Part-time', label: 'Part-time' },
    { id: 'Online', label: 'Online / Distance' },
    { id: 'Hybrid', label: 'Hybrid' },
  ],
  attendance: [
    { id: '', label: 'All Types' },
    { id: 'On-campus', label: 'On-campus' },
    { id: 'Remote', label: 'Remote' },
    { id: 'Flexible', label: 'Flexible' },
  ],
  degree_type: [
    { id: '', label: 'All Degrees' },
    { id: "Bachelor's", label: "Bachelor's" },
    { id: "Master's", label: "Master's" },
    { id: 'PhD', label: 'PhD / Doctoral' },
    { id: 'Diploma', label: 'Diploma / Certificate' },
    { id: 'Postgraduate', label: 'Postgraduate' },
  ],
  special_programme: [
    { id: '', label: 'All Programmes' },
    { id: 'Research', label: 'Research-based' },
    { id: 'Coursework', label: 'Coursework-based' },
    { id: 'Internship', label: 'With Internship' },
    { id: 'Exchange', label: 'Exchange Programme' },
    { id: 'Dual Degree', label: 'Dual Degree' },
  ],
};

const CountryFiltersSidebar = ({ filters, onFilterChange, onResetFilters, resultCount }) => {
  const [expandedSections, setExpandedSections] = useState({
    field_of_study: true,
    location: false,
    university: false,
    tuition_fees: false,
    duration: false,
    format: false,
    attendance: false,
    degree_type: false,
    special_programme: false,
  });

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasActiveFilters = Object.values(filters).some((v) => v);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      {resultCount !== undefined && (
        <div className="mb-4 px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700 font-medium">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </div>
      )}

      {Object.entries(filterOptions).map(([key, options]) => (
        <div key={key} className="mb-1">
          <button
            onClick={() => toggleSection(key)}
            className="w-full flex items-center justify-between py-3 px-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span className="capitalize">
              {key.replace(/_/g, ' ')}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${expandedSections[key] ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections[key] && (
            <div className="px-2 pb-3 space-y-1.5">
              {options.map((option) => (
                <label key={option.id} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name={key}
                    value={option.id}
                    checked={filters[key] === option.id}
                    onChange={(e) => onFilterChange(key, e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2.5 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="pt-4 border-t border-gray-200 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onFilterChange('_apply', '')}
          disabled={!hasActiveFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default CountryFiltersSidebar;
