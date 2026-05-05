import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';

const successStories = [
  {
    name: 'Amara Okafor',
    role: 'MSc Computer Science, University of Edinburgh',
    scholarship: 'Chevening Scholarship 2024',
    image: 'AO',
    quote: 'I almost didn\'t apply because I thought I wasn\'t qualified enough. This platform showed me that my unique background was actually my strongest asset. The application guide gave me the structure I needed to tell my story effectively.',
    country: 'Nigeria',
    year: '2024',
  },
  {
    name: 'Carlos Mendez',
    role: 'PhD Environmental Science, ETH Zurich',
    scholarship: 'Swiss Government Excellence Scholarship',
    image: 'CM',
    quote: 'The Student Resources section was a game-changer. The essay templates helped me organize my research proposal, and the budget calculator showed me I could actually afford to study in Switzerland.',
    country: 'Colombia',
    year: '2023',
  },
  {
    name: 'Fatima Al-Hassan',
    role: 'BA International Relations, Sciences Po Paris',
    scholarship: 'Eiffel Excellence Scholarship',
    image: 'FA',
    quote: 'I applied to 12 scholarships using the strategies I learned here. I received offers from 4 of them. The key was following the step-by-step process and never missing a deadline thanks to the tracking tools.',
    country: 'Morocco',
    year: '2024',
  },
  {
    name: 'Raj Patel',
    role: 'MBA, London Business School',
    scholarship: 'Inlaks Shivdasani Foundation Scholarship',
    image: 'RP',
    quote: 'The interview preparation resources gave me confidence I didn\'t know I had. Practicing with the mock interview scenarios made the real interview feel like a conversation rather than an interrogation.',
    country: 'India',
    year: '2023',
  },
  {
    name: 'Yuki Tanaka',
    role: 'MFA Visual Arts, Royal College of Art London',
    scholarship: 'Toshiba International Foundation Scholarship',
    image: 'YT',
    quote: 'As an art student, I thought scholarship applications weren\'t for me. But the guide showed me how to present my portfolio alongside a compelling personal narrative. I got fully funded for my Master\'s.',
    country: 'Japan',
    year: '2024',
  },
  {
    name: 'Thandiwe Nkosi',
    role: 'MPH Public Health, Johns Hopkins University',
    scholarship: 'Fulbright Foreign Student Program',
    image: 'TN',
    quote: 'I was working full-time and thought I\'d never have time to apply. The timeline templates helped me break the process into manageable weekly tasks. Six months later, I was on a plane to Baltimore.',
    country: 'South Africa',
    year: '2023',
  },
];

const stats = [
  { number: '2,400+', label: 'Students Funded' },
  { number: '85%', label: 'Success Rate' },
  { number: '47', label: 'Countries Represented' },
  { number: '$12M+', label: 'Scholarships Secured' },
];

export default function SuccessStoriesPage() {
  const [filter, setFilter] = React.useState('All');
  const years = ['All', '2024', '2023'];
  const filteredStories = filter === 'All' ? successStories : successStories.filter(s => s.year === filter);

  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      {/* Hero */}
      <Section background="blue" padding="py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Success Stories
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Real students, real scholarships, real impact. Read how our community turned their academic dreams into funded realities.
            </p>
          </div>
        </Container>
      </Section>

      {/* Stats */}
      <Section padding="py-12">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Stories */}
      <Section padding="py-16">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Hear From Our Community</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Every story started with a single application. Here's what happened next.</p>
          </div>

          {/* Year filter */}
          <div className="flex gap-2 justify-center mb-10">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setFilter(year)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === year
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredStories.map((story, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all flex flex-col"
              >
                {/* Quote */}
                <blockquote className="text-gray-600 leading-relaxed mb-6 flex-1 italic">
                  "{story.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm">
                    {story.image}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{story.name}</div>
                    <div className="text-sm text-gray-500">{story.role}</div>
                  </div>
                </div>

                {/* Scholarship badge */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    {story.scholarship}
                  </span>
                  <span className="text-xs text-gray-400">{story.country} · {story.year}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Share Your Story */}
      <Section background="gray" padding="py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Share Your Story</h2>
              <p className="text-gray-600 mb-6">Won a scholarship through our platform? We'd love to feature your experience and inspire the next generation of applicants.</p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Your Story
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section padding="py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Story Could Be Next</h2>
            <p className="text-gray-600 text-lg mb-8">Join thousands of students who found their funding through Scholarships Hub. Start your journey today.</p>
            <Link
              to="/scholarships"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find Your Scholarship
            </Link>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
