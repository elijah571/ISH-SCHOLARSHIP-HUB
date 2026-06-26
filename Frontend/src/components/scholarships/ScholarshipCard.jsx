import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';

const ScholarshipCard = ({ scholarship }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const scholarshipId = scholarship.id || scholarship.id;

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/scholarships/${scholarshipId}`);
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await userService.unsaveScholarship(scholarshipId);
        setIsSaved(false);
      } else {
        await userService.saveScholarship(scholarshipId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to update save status:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleApply = () => {
    navigate(`/scholarships/${scholarshipId}`);
  };

  const getFundingBadge = (type) => {
    const badges = {
      'Fully Funded': { text: 'Fully Funded', className: 'bg-green-100 text-green-800' },
      'fully-funded': { text: 'Fully Funded', className: 'bg-green-100 text-green-800' },
      'Partial Funding': { text: 'Partial Funding', className: 'bg-blue-100 text-blue-800' },
      'partial': { text: 'Partial Funding', className: 'bg-blue-100 text-blue-800' },
    };
    return badges[type] || badges['partial'];
  };

  const formatDeadline = (date) => {
    if (!date) return 'No deadline';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const fundingBadge = getFundingBadge(scholarship.funding_type || scholarship.fundingType);
  const imageUrl = scholarship.image?.url || scholarship.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=400&fit=crop';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt={scholarship.title}
            className="w-full md:w-24 h-24 rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {scholarship.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {scholarship.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {scholarship.country}
            </div>
            {scholarship.duration && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {scholarship.duration}
              </div>
            )}
            <div className="flex items-center text-orange-600 font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Deadline: {formatDeadline(scholarship.deadline)}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={handleApply} className="px-5">
              {isAuthenticated ? 'Apply Now' : 'View Details'}
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg
                  className={`w-4 h-4 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`}
                  fill={isSaved ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </Button>
          </div>
        </div>

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
