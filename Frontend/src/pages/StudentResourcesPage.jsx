import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';

const resourceCategories = [
  {
    title: 'Application Tools',
    description: 'Software and platforms to streamline your application process.',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    iconCenter: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    items: [
      { name: 'Scholarship Tracker Template', desc: 'Google Sheets template to organize applications, deadlines, and requirements', type: 'Template' },
      { name: 'Document Checklist Builder', desc: 'Generate a personalized checklist based on the scholarships you\'re targeting', type: 'Tool' },
      { name: 'Deadline Reminder Calendar', desc: 'ICS calendar file with all major scholarship deadlines pre-loaded', type: 'Download' },
    ],
  },
  {
    title: 'Writing Resources',
    description: 'Guides, examples, and tools to craft compelling application essays.',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    items: [
      { name: 'Essay Structure Guide', desc: 'Proven framework for personal statements — introduction, body, and conclusion templates', type: 'Guide' },
      { name: 'Winning Essay Examples', desc: 'Real essays from successful scholarship recipients across different programs', type: 'Examples' },
      { name: 'Grammar & Style Checker', desc: 'Free tools to polish your writing and eliminate common errors', type: 'Tool' },
      { name: 'Brainstorming Worksheet', desc: 'Exercises to help you identify your unique story and key achievements', type: 'Template' },
    ],
  },
  {
    title: 'Interview Preparation',
    description: 'Everything you need to ace scholarship interviews with confidence.',
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    items: [
      { name: 'Common Interview Questions', desc: '50+ questions frequently asked in scholarship interviews with sample answers', type: 'Guide' },
      { name: 'Mock Interview Practice', desc: 'Self-guided practice scenarios with evaluation criteria', type: 'Exercise' },
      { name: 'Body Language Tips', desc: 'Non-verbal communication guide for virtual and in-person interviews', type: 'Guide' },
    ],
  },
  {
    title: 'Financial Planning',
    description: 'Resources to understand funding, budgeting, and financial aid options.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    items: [
      { name: 'Study Abroad Budget Calculator', desc: 'Estimate your total costs including tuition, living expenses, and travel', type: 'Tool' },
      { name: 'Financial Aid Glossary', desc: 'Understand key terms: grants, loans, fellowships, work-study, and more', type: 'Guide' },
      { name: 'Funding Combination Guide', desc: 'How to stack multiple scholarships and grants to fully fund your education', type: 'Guide' },
    ],
  },
];

const externalLinks = [
  { name: 'Scholarship Portal', url: 'https://www.scholars4dev.com', desc: 'Comprehensive database of international scholarships' },
  { name: 'IELTS Official', url: 'https://www.ielts.org', desc: 'Book your English proficiency test' },
  { name: 'Coursera', url: 'https://www.coursera.org', desc: 'Free and paid courses to strengthen your profile' },
  { name: 'DAAD', url: 'https://www.daad.de', desc: 'German Academic Exchange Service scholarships' },
  { name: 'Chevening', url: 'https://www.chevening.org', desc: 'UK government global scholarship programme' },
  { name: 'Fulbright', url: 'https://us.fulbrightonline.org', desc: 'U.S. government international exchange program' },
];

export default function StudentResourcesPage() {
  const [activeCategory, setActiveCategory] = React.useState(0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      {/* Hero */}
      <Section background="blue" padding="py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Student Resources
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              A curated collection of tools, templates, and guides to help you succeed at every stage of your scholarship journey.
            </p>
          </div>
        </Container>
      </Section>

      {/* Resource Categories */}
      <Section padding="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find exactly what you need organized by the type of support.</p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {resourceCategories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === i
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Active category resources */}
          {resourceCategories.map((cat, i) => (
            activeCategory === i && (
              <div key={i} className="max-w-4xl mx-auto">
                <p className="text-gray-600 text-center mb-8">{cat.description}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {cat.items.map((item, j) => (
                    <div
                      key={j}
                      className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {item.name}
                            </h3>
                            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </Container>
      </Section>

      {/* External Resources */}
      <Section background="gray" padding="py-16">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trusted External Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Recommended platforms and organizations that can help expand your opportunities.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {externalLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {link.name}
                  </h3>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0 0L11 13" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section padding="py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Personalized Help?</h2>
              <p className="text-gray-600 mb-6">Our team can review your application materials and provide tailored feedback to strengthen your chances.</p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
