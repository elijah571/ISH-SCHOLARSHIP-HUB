import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';

const steps = [
  {
    number: 1,
    title: 'Search for Opportunities',
    description: 'Use our scholarship finder to discover programs that match your academic profile, field of study, and location preferences. Filter by country, funding type, and deadline.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    tips: ['Set up email alerts for new scholarships', 'Check both local and international opportunities'],
  },
  {
    number: 2,
    title: 'Review Eligibility Requirements',
    description: 'Carefully read the eligibility criteria for each scholarship. Check academic requirements, age limits, citizenship restrictions, and language proficiency expectations.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    tips: ['Create a spreadsheet to track requirements', 'Note which requirements you already meet'],
  },
  {
    number: 3,
    title: 'Prepare Required Documents',
    description: 'Gather all necessary materials: academic transcripts, letters of recommendation, proof of language proficiency, CV/resume, and any portfolio or writing samples.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    tips: ['Start collecting documents early', 'Request recommendation letters at least 4 weeks before deadline'],
  },
  {
    number: 4,
    title: 'Write a Compelling Essay',
    description: 'Craft a personal statement that clearly communicates your goals, achievements, and why you deserve the scholarship. Be authentic, specific, and proofread thoroughly.',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    tips: ['Answer the prompt directly', 'Show, don\'t just tell — use concrete examples'],
  },
  {
    number: 5,
    title: 'Submit Your Application',
    description: 'Complete the application form carefully. Double-check all fields, attach the correct documents, and submit well before the deadline to avoid last-minute technical issues.',
    icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m9-9a9 9 0 11-18 0 9 9 0 0118 0z',
    tips: ['Submit at least 48 hours before deadline', 'Save a copy of your entire application'],
  },
  {
    number: 6,
    title: 'Follow Up & Prepare for Interviews',
    description: 'After submission, monitor your email for confirmation and any follow-up requests. If shortlisted, prepare for interviews by researching the organization and practicing common questions.',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    tips: ['Prepare a 2-minute personal pitch', 'Research the scholarship\'s mission and values'],
  },
];

const faqs = [
  { question: 'How many scholarships should I apply to?', answer: 'Apply to as many as you qualify for. We recommend targeting at least 5-10 opportunities to maximize your chances of success.' },
  { question: 'Can I apply for multiple scholarships at once?', answer: 'Yes! You can and should apply to multiple scholarships simultaneously. Just keep track of each deadline and requirement.' },
  { question: 'What if I don\'t meet all the requirements?', answer: 'Some scholarships have flexible criteria. If you meet most requirements and have strong qualifications, it\'s still worth applying.' },
  { question: 'How long does the application process take?', answer: 'Typically 2-6 weeks from research to submission, depending on the complexity of requirements and your preparation level.' },
];

export default function ApplyGuidePage() {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      <Section background="blue" padding="py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Scholarship Application Guide
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              A step-by-step roadmap to help you navigate the scholarship application process with confidence — from discovery to acceptance.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Application Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Follow these six proven steps to build strong applications and improve your chances of winning funding.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex gap-6 md:gap-8 pb-12 last:pb-0">
                {index < steps.length - 1 && (
                  <div className="absolute left-5 md:left-7 top-12 bottom-0 w-0.5 bg-blue-200" />
                )}

                <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-lg z-10">
                  {step.number}
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-800 mb-2">Pro Tips:</p>
                    <ul className="space-y-1">
                      {step.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Application Checklist</h2>
            <p className="text-gray-600 text-center mb-8">Use this checklist to ensure you have everything ready before you start applying.</p>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
              {[
                'Updated CV / Resume',
                'Academic transcripts (official copies)',
                'Letters of recommendation (2-3)',
                'Language proficiency test scores (IELTS/TOEFL)',
                'Personal statement / motivation letter',
                'Research proposal (if required)',
                'Portfolio or writing samples',
                'Passport copy / identification',
                'Financial need documentation',
                'Application fee (if applicable)',
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-center mb-10">Quick answers to common application questions.</p>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="blue" padding="py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Applying?</h2>
            <p className="text-blue-100 text-lg mb-8">Browse hundreds of scholarship opportunities and find your perfect match today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/scholarships"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Browse Scholarships
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
