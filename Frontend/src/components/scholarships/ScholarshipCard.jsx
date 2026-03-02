import React, { useState } from 'react';
import Button from '../Button';

const ScholarshipCard = ({ scholarship }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleApply = () => {
    console.log('Applying for scholarship:', scholarship.id);
  };

  const getFundingBadge = (type) => {
    const badges = {
      'fully-funded': {
        text: 'Fully Funded',
        className: 'bg-green-100 text-green-800'
      },
      'partial': {
        text: 'Partial Funding',
        className: 'bg-blue-100 text-blue-800'
      }
    };
    return badges[type] || badges['partial'];
  };

  const fundingBadge = getFundingBadge(scholarship.fundingType);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left: Thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={scholarship.image}
            alt={scholarship.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>

        {/* Middle: Content */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {scholarship.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {scholarship.description}
            </p>
          </div>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {scholarship.country}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {scholarship.amount}
            </div>
            <div className="flex items-center text-orange-600 font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Deadline: {scholarship.deadline}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={handleApply} className="px-6">
              Apply Now
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSave}
              className="flex items-center space-x-2"
            >
              <svg 
                className={`w-4 h-4 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`} 
                fill={isSaved ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </Button>
          </div>
        </div>

        {/* Right: Badge */}
        <div className="flex-shrink-0">
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${fundingBadge.className}`}>
            {fundingBadge.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;