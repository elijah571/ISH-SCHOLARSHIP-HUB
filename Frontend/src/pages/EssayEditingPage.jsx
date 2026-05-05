import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';

const tiers = [
  {
    name: 'Proofread',
    price: 'Free',
    desc: 'Surface-level correction for grammar, spelling, and punctuation errors.',
    features: ['Grammar & spelling check', 'Punctuation correction', 'Basic formatting review', '48-hour turnaround'],
    highlight: false,
  },
  {
    name: 'Structural Edit',
    price: 'Included',
    desc: 'Deep restructuring for clarity, flow, and persuasive narrative impact.',
    features: ['Everything in Proofread', 'Paragraph restructuring', 'Logical flow optimization', 'Tone & voice alignment', 'Scholarship-specific tailoring', '24-hour turnaround'],
    highlight: true,
  },
  {
    name: 'Full Rewrite',
    price: 'Premium',
    desc: 'Expert-crafted essay built from your raw ideas and bullet points.',
    features: ['Everything in Structural', 'Complete rewrite from outline', 'Multiple revision rounds', 'Dedicated editor assigned', 'Priority 12-hour turnaround'],
    highlight: false,
  },
];

const examples = [
  {
    label: 'Personal Statement',
    snippet: 'The most transformative moment of my academic career wasn\'t in a lecture hall — it was standing in a community health clinic in rural Lagos, realizing that the gap between knowledge and access is where real change begins...',
  },
  {
    label: 'Career Goals Essay',
    snippet: 'In five years, I see myself at the intersection of data science and public policy, building predictive models that help governments allocate educational resources where they\'re needed most...',
  },
  {
    label: 'Leadership Essay',
    snippet: 'When our student association faced a funding crisis, I didn\'t wait for someone else to act. I organized a crowdfunding campaign that raised three times our annual budget in just two weeks...',
  },
];

export default function EssayEditingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      <Section background="blue" padding="py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Essay Editing Service
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Your story deserves to be told well. Our editors transform rough drafts into polished essays that capture attention, convey authenticity, and win scholarships.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Level</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">From a quick proofread to a complete editorial overhaul — pick what your essay needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 flex flex-col ${
                  tier.highlight
                    ? 'bg-blue-600 text-white shadow-xl ring-2 ring-blue-600 ring-offset-2'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h3 className={`text-lg font-semibold mb-1 ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>{tier.name}</h3>
                <div className={`text-2xl font-bold mb-2 ${tier.highlight ? 'text-white' : 'text-blue-600'}`}>{tier.price}</div>
                <p className={`text-sm mb-6 ${tier.highlight ? 'text-blue-100' : 'text-gray-600'}`}>{tier.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.highlight ? 'text-blue-200' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={tier.highlight ? 'text-blue-50' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-lg font-semibold transition-colors ${
                    tier.highlight
                      ? 'bg-white text-blue-700 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="py-16">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Essay Styles We Edit</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Whatever the prompt, we've got you covered.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {examples.map((ex, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{ex.label}</span>
                <p className="text-gray-700 leading-relaxed mt-3 italic">"{ex.snippet}"</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Submit Your Essay Today</h2>
            <p className="text-gray-600 text-lg mb-8">Upload your draft and let our editors bring out your best voice.</p>
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Upload Essay
            </Link>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
