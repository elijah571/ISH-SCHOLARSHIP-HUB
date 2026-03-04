import React from 'react';
import Button from '../Button';
import ScholarshipCard from './ScholarshipCard';

const ScholarshipList = ({ search, filters, sortBy, currentPage }) => {
  // Mock data - in real app this would come from API
  const scholarships = [
    {
      id: 1,
      title: 'Fulbright Foreign Student Program',
      description: 'Fully funded scholarships for graduate students to study in the United States. Covers tuition, living expenses, and travel.',
      organization: 'U.S. Department of State',
      country: 'United States',
      amount: '$25,000',
      deadline: '2024-10-15',
      fundingType: 'fully-funded',
      image: 'https://plus.unsplash.com/premium_photo-1683887034473-74e486cdb7a1?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 2,
      title: 'Chevening Scholarship',
      description: 'Prestigious international awards funded by the UK government for one-year master\'s programs at UK universities.',
      organization: 'UK Government',
      country: 'United Kingdom',
      amount: '£18,000',
      deadline: '2024-11-01',
      fundingType: 'fully-funded',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      title: 'Australia Awards Scholarships',
      description: 'Long-term awards for students from developing countries to undertake full-time undergraduate or postgraduate study.',
      organization: 'Australian Government',
      country: 'Australia',
      amount: '$30,000',
      deadline: '2024-12-01',
      fundingType: 'fully-funded',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 4,
      title: 'Erasmus Mundus Joint Master Degrees',
      description: 'High-level integrated international study programs at master level delivered by consortia of higher education institutions.',
      organization: 'European Commission',
      country: 'Europe',
      amount: '€25,000',
      deadline: '2024-09-30',
      fundingType: 'fully-funded',
      image: 'https://media.istockphoto.com/id/2197964909/photo/back-view-three-multiracial-people-outside-go-to-class-lesson-studying-together-students.jpg?s=2048x2048&w=is&k=20&c=-RMvJGB5s1umRT57I3ghsePBglZEvLMcrBAL_ToHT9U='
    },
    {
      id: 5,
      title: 'DAAD Scholarships',
      description: 'Scholarships for international students to study in Germany at various degree levels and fields of study.',
      organization: 'German Academic Exchange Service',
      country: 'Germany',
      amount: '€10,000',
      deadline: '2024-11-15',
      fundingType: 'partial',
      image: 'https://media.istockphoto.com/id/2226813174/photo/portrait-of-a-happy-college-student-smiling-outdoors.jpg?s=2048x2048&w=is&k=20&c=MHKS2S9ZJEd1fvQll2iYESwF9pRrMe-tGMiFz3rETCw='
    },
    {
      id: 6,
      title: 'Rhodes Scholarship',
      description: 'One of the oldest and most prestigious international scholarship programs, enabling outstanding students to study at the University of Oxford.',
      organization: 'Rhodes Trust',
      country: 'United Kingdom',
      amount: 'Full tuition and living expenses',
      deadline: '2024-10-01',
      fundingType: 'fully-funded',
      image: 'https://plus.unsplash.com/premium_photo-1683887034473-74e486cdb7a1?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ];

  return (
    <div className="space-y-4">
      {scholarships.map((scholarship) => (
        <ScholarshipCard
          key={scholarship.id}
          scholarship={scholarship}
        />
      ))}
    </div>
  );
};

export default ScholarshipList;