import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';

const topics = [
  { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', title: 'Tell Me About Yourself', desc: 'Craft a compelling 2-minute personal pitch that highlights your academic journey and future goals.' },
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Strengths & Weaknesses', desc: 'Frame your genuine weaknesses as growth opportunities while showcasing authentic strengths.' },
  { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: 'Why This Scholarship?', desc: 'Demonstrate deep understanding of the scholarship\'s mission and how you embody its values.' },
  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Handling Behavioral Questions', desc: 'Master the STAR method to structure compelling answers with real examples from your experience.' },
  { icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Asking Smart Questions', desc: 'Prepare thoughtful questions that show engagement and help you evaluate if the scholarship is right for you.' },
  { icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Managing Interview Anxiety', desc: 'Practical techniques to stay calm, think clearly, and present your best self under pressure.' },
];

const tips = [
  { title: 'Research Thoroughly', desc: 'Study the organization\'s history, recent news, and past scholarship recipients before your interview.' },
  { title: 'Practice Out Loud', desc: 'Record yourself answering common questions. Listening back reveals verbal tics and areas to improve.' },
  { title: 'Prepare Your Space', desc: 'For virtual interviews: test your camera, lighting, and internet connection at least 30 minutes before.' },
  { title: 'Dress One Level Up', desc: 'Dress slightly more formally than the organization\'s everyday culture to show respect and professionalism.' },
];

export default function InterviewPrepPage() {
  const [activeTopic, setActiveTopic] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      <Section background="blue" padding="py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Interview Preparation
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Go from nervous to confident with our structured interview preparation system. Practice real questions, master proven frameworks, and walk into every interview ready.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Topics</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Master every type of question you'll face. Click each topic to explore strategies and examples.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {topics.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTopic(activeTopic === i ? null : i)}
                className="group text-left bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{t.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
              </button>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pre-Interview Checklist</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Complete these steps before every interview to maximize your performance.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
              {tips.map((tip, i) => (
                <div key={i} className="flex gap-4 p-5">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Personalized Coaching?</h2>
            <p className="text-gray-600 text-lg mb-8">Book a one-on-one mock interview session with our advisors. Get real-time feedback tailored to your specific scholarship applications.</p>
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Book a Session
            </Link>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
