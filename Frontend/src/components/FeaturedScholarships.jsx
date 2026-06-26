import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Section } from './Layout';
import Card from './Card';
import Button from './Button';
import scholarshipService from '../services/scholarshipService';

const BuildingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="w-8 h-8 animate-spin text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const FeaturedScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await scholarshipService.getAll({ limit: 3 });
        const data = response.data;
        const items = data.scholarships || data.data || [];
        setScholarships(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error('Failed to fetch featured scholarships:', err);
        setError('Failed to load scholarships');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Scholarships
            </h2>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>
          <Link 
            to="/scholarships" 
            className="text-blue-600 hover:text-blue-700 font-medium mt-4 md:mt-0 transition-colors duration-200"
          >
            View all opportunities →
          </Link>
        </div>

        {loading ? (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="py-12 text-center text-gray-500">
            <p>{error}</p>
          </div>
        ) : scholarships.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p>No scholarships available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scholarships.map((scholarship) => (
              <Card key={scholarship.id} className="overflow-hidden">
                <Card.Image 
                  src={scholarship.image?.url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80'} 
                  alt={scholarship.title}
                />
                <Card.Content>
                  <div className="flex items-center gap-2 mb-2">
                    {scholarship.funding_type && (
                      <Card.Badge variant="primary">
                        {scholarship.funding_type}
                      </Card.Badge>
                    )}
                    {scholarship.country && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <GlobeIcon />
                        {scholarship.country}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {scholarship.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {scholarship.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    {scholarship.country && (
                      <div className="flex items-center">
                        <GlobeIcon />
                        <span className="ml-2">{scholarship.country}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <CalendarIcon />
                      <span className="ml-2">Deadline: {formatDate(scholarship.deadline)}</span>
                    </div>
                  </div>
                  
                  <Link to={`/scholarships/${scholarship.id}`}>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </Card.Content>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
};

export default FeaturedScholarships;