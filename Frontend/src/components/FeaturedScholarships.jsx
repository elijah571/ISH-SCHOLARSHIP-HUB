import React from 'react';
import { Container, Section } from './Layout';
import Card from './Card';
import Button from './Button';

const FeaturedScholarships = () => {
  const scholarships = [
    {
      id: 1,
      title: 'Fulbright Foreign Student Program',
      description: 'Fully funded scholarships for graduate students, artists, and young professionals to study in the United States.',
      organization: 'U.S. Department of State',
      deadline: 'October 15, 2024',
      type: 'Masters',
      image: 'https://plus.unsplash.com/premium_photo-1683887034473-74e486cdb7a1?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 2,
      title: 'Chevening Scholarship',
      description: 'Prestigious international awards funded by the UK government to study a one-year master\'s degree in any UK university.',
      organization: 'UK Government',
      deadline: 'November 1, 2024',
      type: 'Masters',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      title: 'Australia Awards Scholarships',
      description: 'Long-term awards administered by the Department of Foreign Affairs to undertake study, research and professional development.',
      organization: 'Australian Government',
      deadline: 'December 1, 2024',
      type: 'PhD',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Scholarships
            </h2>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>
          <a 
            href="/scholarships" 
            className="text-blue-600 hover:text-blue-700 font-medium mt-4 md:mt-0 transition-colors duration-200"
          >
            View all opportunities →
          </a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="overflow-hidden">
              <Card.Image 
                src={scholarship.image} 
                alt={scholarship.title}
              />
              <Card.Content>
                <Card.Badge variant="primary">
                  {scholarship.type}
                </Card.Badge>
                
                <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">
                  {scholarship.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {scholarship.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {scholarship.organization}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Deadline: {scholarship.deadline}
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </Card.Content>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default FeaturedScholarships;