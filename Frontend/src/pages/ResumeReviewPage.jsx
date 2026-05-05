import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';

const features = [
  { title: 'ATS-Optimized Format', desc: 'Your resume will pass automated screening systems used by universities and employers worldwide.' },
  { title: 'Achievement-Focused', desc: 'We reframe your experiences using action-oriented language that highlights impact, not just duties.' },
  { title: 'Scholarship-Aligned', desc: 'Tailored to emphasize the qualities scholarship committees look for — leadership, impact, and potential.' },
  { title: '48-Hour Turnaround', desc: 'Receive your professionally revised resume within 2 business days of submission.' },
];

const process = [
  { step: 1, title: 'Upload Your Resume', desc: 'Submit your current resume through your dashboard. Any format accepted — Word, PDF, or plain text.' },
  { step: 2, title: 'Expert Review', desc: 'A dedicated reviewer with scholarship application experience analyzes your resume against best practices.' },
  { step: 3, title: 'Detailed Revision', desc: 'Your resume is rewritten with improved structure, stronger language, and strategic emphasis on key achievements.' },
  { step: 4, title: 'Delivery & Feedback', desc: 'Receive your revised resume with a summary explaining every change and why it matters.' },
];

const beforeAfter = [
  { before: 'Responsible for managing a team of 5 students in a community project.', after: 'Led a cross-functional team of 5 to deliver a community outreach initiative impacting 200+ residents.' },
  { before: 'Helped organize university events and fundraisers.', after: 'Co-organized 3 university-wide events, raising $15,000 for student scholarship funds.' },
  { before: 'Completed research on renewable energy systems.', after: 'Authored a 40-page research analysis on renewable energy adoption patterns, cited by 3 faculty publications.' },
];

export default function ResumeReviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      <Section background="blue" padding="py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Resume Review Service
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Transform your resume from a list of duties into a compelling narrative that scholarship committees remember. Our experts know exactly what selection panels look for.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What You Get</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A comprehensive resume overhaul designed specifically for scholarship applications.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Before & After</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">See how we transform weak bullet points into powerful achievements.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {beforeAfter.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  <div className="p-5 bg-red-50/50">
                    <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Before</span>
                    <p className="text-gray-700 mt-2 leading-relaxed">{item.before}</p>
                  </div>
                  <div className="p-5 bg-green-50/50">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">After</span>
                    <p className="text-gray-700 mt-2 leading-relaxed">{item.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Four simple steps from upload to a stronger resume.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            {process.map((p, i) => (
              <div key={i} className="relative flex gap-6 pb-10 last:pb-0">
                {i < process.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-blue-200" />
                )}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold z-10">
                  {p.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{p.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="blue" padding="py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Upgrade Your Resume?</h2>
            <p className="text-blue-100 text-lg mb-8">Create a free account and submit your resume for professional review within minutes.</p>
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Start Free Review
            </Link>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
