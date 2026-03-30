import React, { useState } from 'react';
import { Container } from './Layout';
import { Select } from './Input';
import Button from './Button';

const SearchBar = () => {
  const [searchData, setSearchData] = useState({
    country: '',
    degree: '',
    deadline: ''
  });

  const countries = [
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'canada', label: 'Canada' },
    { value: 'australia', label: 'Australia' },
    { value: 'germany', label: 'Germany' },
    { value: 'france', label: 'France' }
  ];

  const degrees = [
    { value: 'bachelors', label: 'Bachelors' },
    { value: 'masters', label: 'Masters' },
    { value: 'phd', label: 'PhD' },
    { value: 'postdoc', label: 'Postdoctoral' }
  ];

  const deadlines = [
    { value: 'this-month', label: 'This Month' },
    { value: 'next-month', label: 'Next Month' },
    { value: 'next-3-months', label: 'Next 3 Months' },
    { value: 'next-6-months', label: 'Next 6 Months' }
  ];

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    return searchData;
  };

  return (
    <div className="relative -mt-12 z-20">
      <Container>
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label=""
              placeholder="Select Country"
              options={countries}
              value={searchData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="h-12"
            />
            
            <Select
              label=""
              placeholder="Select Degree"
              options={degrees}
              value={searchData.degree}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              className="h-12"
            />
            
            <Select
              label=""
              placeholder="Deadline"
              options={deadlines}
              value={searchData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              className="h-12"
            />
            
            <Button 
              onClick={handleSearch}
              className="h-12 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SearchBar;
