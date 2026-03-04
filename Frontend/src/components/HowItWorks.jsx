import React from 'react';
import { Container, Section } from './Layout';

const HowItWorks = () => {
  const steps = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: 'bg-blue-500',
      title: 'Search Opportunities',
      description: 'Browse through our extensive database of scholarships, internships, and educational programs worldwide.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
      color: 'bg-cyan-500',
      title: 'Bookmark & Save',
      description: 'Save opportunities that match your profile and create personalized lists for easy tracking.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      title: 'Apply & Succeed',
      description: 'Get application assistance and join thousands of successful students who secured funding.'
    }
  ];

  return (
    <Section background="gray">
      <Container>
        {/* Centered Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Find your perfect scholarship in three simple steps. Our platform makes it easy to discover, track, and apply for educational opportunities worldwide.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Circular Icon */}
              <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white`}>
                {step.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default HowItWorks;