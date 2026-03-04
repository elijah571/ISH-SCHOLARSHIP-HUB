import React from 'react';
import { Container, Section } from './Layout';

const Stats = () => {
  const stats = [
    { number: '500+', label: 'Scholarships' },
    { number: '80+', label: 'Countries' },
    { number: '200K+', label: 'Active Students' },
    { number: '100K+', label: 'Success Stories' }
  ];

  return (
    <Section background="gray">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Stats;