import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';
import Button from '../components/Button';

const internshipData = {
  id: '1',
  title: 'Software Engineering Intern',
  company: 'TechCorp Inc.',
  companyLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop',
  location: 'San Francisco, CA',
  type: 'paid',
  duration: '12 weeks',
  deadline: 'November 15, 2024',
  salary: '$5,000/month',
  startDate: 'January 2025',
  remote: 'Hybrid',
  industry: 'Technology',
  overview: `Join TechCorp's engineering team as a Software Engineering Intern and work on real products that millions of users interact with daily. You'll collaborate with experienced engineers, participate in code reviews, and ship features to production.

This internship is designed to give you hands-on experience with modern development practices, including agile methodologies, CI/CD pipelines, and cloud-native architectures. You'll have the opportunity to work on both frontend and backend systems.`,
  requirements: [
    'Currently enrolled in a Computer Science or related degree program',
    'Proficiency in at least one programming language (Python, JavaScript, Java, or Go)',
    'Understanding of data structures and algorithms',
    'Familiarity with Git version control',
    'Strong problem-solving and communication skills',
    'Ability to work collaboratively in a team environment'
  ],
  benefits: [
    { title: 'Competitive Salary', description: '$5,000/month plus housing stipend for eligible candidates' },
    { title: 'Mentorship Program', description: 'Paired with a senior engineer for guidance throughout your internship' },
    { title: 'Learning Budget', description: '$1,000 for courses, books, and conferences during your tenure' },
    { title: 'Full-time Opportunities', description: 'Performance-based return offer for full-time employment after graduation' }
  ],
  responsibilities: [
    'Write clean, maintainable code following team best practices',
    'Participate in sprint planning and daily standups',
    'Collaborate with product managers and designers',
    'Debug and resolve software defects',
    'Present your work to the team at the end of the internship'
  ],
  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop'
};

const InternshipDetailsPage = () => {
  useParams();
  const internship = internshipData;

  const getTypeBadge = (type) => {
    const badges = {
      'paid': { text: 'PAID INTERNSHIP', className: 'bg-emerald-500' },
      'unpaid': { text: 'UNPAID', className: 'bg-amber-500' },
      'stipend': { text: 'STIPEND', className: 'bg-blue-500' }
    };
    return badges[type] || badges['paid'];
  };

  const typeBadge = getTypeBadge(internship.type);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar buttonText="Subscribe" buttonLink="/register" />

      <div className="relative h-72">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${internship.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-blue-900/60" />
        </div>

        <div className="absolute bottom-[-40px] left-10 w-[70%] max-w-3xl">
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/20">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${typeBadge.className} text-white mb-3`}>
              {typeBadge.text}
            </span>
            
            <h1 className="text-4xl font-bold leading-tight mb-2">
              {internship.title}
            </h1>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/90 font-medium">{internship.company}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-5 text-white/90 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {internship.location}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Deadline: {internship.deadline}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />

      <Section padding="pb-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Quick Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Salary</span>
                    <span className="text-emerald-500 font-semibold text-sm">
                      {internship.salary}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Duration</span>
                    <span className="text-gray-900 font-medium text-sm">{internship.duration}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Start Date</span>
                    <span className="text-gray-900 font-medium text-sm">{internship.startDate}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Work Mode</span>
                    <span className="text-gray-900 font-medium text-sm">{internship.remote}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Industry</span>
                    <span className="text-gray-900 font-medium text-sm">{internship.industry}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500 text-sm">Spots Available</span>
                    <span className="text-blue-600 font-medium text-sm">3 positions</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Share This Opportunity
                  </p>
                  <div className="flex gap-2.5">
                    <button className="w-10 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                    <button className="w-10 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </button>
                    <button className="w-10 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                    <button className="w-10 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1.5">
                  Need Application Help?
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Get expert guidance on your application, resume review, and interview preparation.
                </p>
                <Link to="/contact" className="text-blue-600 font-medium text-sm mt-2 inline-block hover:underline">
                  Get Support →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Overview
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {internship.overview}
                </p>
              </div>

              <div className="h-px bg-gray-200" />

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {internship.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-gray-200" />

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {internship.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-sm text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-gray-200" />

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What We Offer
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {internship.benefits.map((benefit, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1.5">
                        {benefit.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button className="px-5 py-2.5 shadow-lg shadow-emerald-600/25">
                  Apply Now
                </Button>
                <Button variant="outline" className="px-5 py-2.5">
                  Save for Later
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
};

export default InternshipDetailsPage;
