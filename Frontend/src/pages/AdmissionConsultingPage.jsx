import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';

const benefits = [
  { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: 'University Selection', desc: 'Expert guidance on choosing programs that align with your career goals, academic profile, and financial situation.' },
  { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Application Strategy', desc: 'A personalized roadmap that maps out which scholarships to target, when to apply, and how to position yourself.' },
  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', title: 'Profile Building', desc: 'Identify gaps in your profile and get actionable recommendations for activities, certifications, and experiences.' },
  { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', title: 'Interview Coaching', desc: 'One-on-one mock interviews with personalized feedback, body language coaching, and confidence building.' },
];

const faqs = [
  { q: 'Who are the consultants?', a: 'Our consultants are former scholarship committee members, admissions officers, and successful scholarship recipients with direct experience in the selection process.' },
  { q: 'How many sessions will I need?', a: 'Most students benefit from 2-4 sessions over a 4-8 week period. Your consultant will recommend a plan based on your timeline and needs.' },
  { q: 'Can you guarantee I\'ll win a scholarship?', a: 'No one can guarantee scholarship success. What we can guarantee is that your application will be as strong, polished, and strategically positioned as possible.' },
  { q: 'Do you work with students from all countries?', a: 'Yes. Our consultants have experience with international applications across 40+ countries and 200+ scholarship programs.' },
];

export default function AdmissionConsultingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      <Section background="blue" padding="py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Admission Consulting
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Get a seasoned advisor in your corner. Our consultants have sat on both sides of the selection table — and they'll help you think like the committee.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What Consulting Covers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">End-to-end support from choosing the right programs to signing your acceptance letter.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Common Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Consulting Journey</h2>
            <p className="text-gray-600 text-lg mb-8">Book a free 15-minute discovery call to see if consulting is right for you.</p>
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Book Free Discovery Call
            </Link>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
