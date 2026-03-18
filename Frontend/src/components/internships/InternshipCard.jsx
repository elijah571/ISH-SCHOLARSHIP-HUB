import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';

const InternshipCard = ({ internship }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const getTypeBadge = (type) => {
    const badges = {
      'paid': {
        text: 'Paid',
        className: 'bg-green-100 text-green-800'
      },
      'unpaid': {
        text: 'Unpaid',
        className: 'bg-amber-100 text-amber-800'
      },
      'stipend': {
        text: 'Stipend',
        className: 'bg-blue-100 text-blue-800'
      }
    };
    return badges[type] || badges['paid'];
  };

  const typeBadge = getTypeBadge(internship.type);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-shrink-0">
          <img
            src={internship.image}
            alt={internship.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {internship.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {internship.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {internship.location}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {internship.company}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {internship.duration}
            </div>
            <div className="flex items-center text-orange-600 font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Deadline: {internship.deadline}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to={`/internships/${internship.id}`}>
              <Button className="px-6">
                View Details
              </Button>
            </Link>
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

        <div className="flex-shrink-0">
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${typeBadge.className}`}>
            {typeBadge.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;
