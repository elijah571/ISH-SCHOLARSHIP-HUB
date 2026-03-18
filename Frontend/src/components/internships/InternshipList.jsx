import React from 'react';
import InternshipCard from './InternshipCard';

const InternshipList = () => {
  const internships = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      description: 'Join our engineering team to work on cutting-edge web applications. You will collaborate with senior developers on real projects.',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'paid',
      duration: '12 weeks',
      deadline: '2024-11-15',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Marketing & Communications Intern',
      description: 'Help drive our brand presence through social media management, content creation, and market research initiatives.',
      company: 'Global Media Group',
      location: 'New York, NY',
      type: 'paid',
      duration: '6 months',
      deadline: '2024-12-01',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Data Science Research Intern',
      description: 'Work with our data science team on machine learning models, statistical analysis, and big data processing projects.',
      company: 'AI Research Labs',
      location: 'Remote',
      type: 'stipend',
      duration: '3 months',
      deadline: '2024-10-30',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Environmental Science Fellowship',
      description: 'Participate in field research, environmental impact assessments, and sustainability initiative planning.',
      company: 'Green Earth Foundation',
      location: 'Seattle, WA',
      type: 'stipend',
      duration: '8 weeks',
      deadline: '2024-11-20',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'UX Design Intern',
      description: 'Assist in user research, wireframing, prototyping, and usability testing for our mobile and web products.',
      company: 'DesignHub Studio',
      location: 'Austin, TX',
      type: 'paid',
      duration: '4 months',
      deadline: '2024-12-15',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop'
    },
    {
      id: 6,
      title: 'Finance & Investment Analyst',
      description: 'Gain hands-on experience in financial modeling, market analysis, and investment portfolio management.',
      company: 'Sterling Financial',
      location: 'Chicago, IL',
      type: 'paid',
      duration: '10 weeks',
      deadline: '2024-11-10',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="space-y-4">
      {internships.map((internship) => (
        <InternshipCard
          key={internship.id}
          internship={internship}
        />
      ))}
    </div>
  );
};

export default InternshipList;
