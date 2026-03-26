import React from 'react';
import ScholarshipCard from './ScholarshipCard';
import Loader from '../Loader';

const ScholarshipList = ({ scholarships, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Scholarships</h3>
        <p className="text-red-600 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!scholarships || scholarships.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Scholarships Found</h3>
        <p className="text-gray-500">
          Try adjusting your filters or search terms to find more opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scholarships.map((scholarship) => (
        <ScholarshipCard
          key={scholarship._id || scholarship.id}
          scholarship={scholarship}
        />
      ))}
    </div>
  );
};

export default ScholarshipList;
