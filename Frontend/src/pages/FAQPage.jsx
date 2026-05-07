import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';

const faqCategories = [
  {
    name: 'General',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    items: [
      { q: 'What is Scholarships Hub?', a: 'Scholarships Hub is a free platform that connects students with scholarship opportunities worldwide. We provide application guidance, resources, and expert support to help you secure funding for your education.' },
      { q: 'Is it really free to use?', a: 'Yes. Browsing scholarships, using our resources, and creating an account are completely free. Our premium services — like essay editing and consulting — are optional.' },
      { q: 'Who can use this platform?', a: 'Any student currently studying or planning to study at the undergraduate, graduate, or postgraduate level. We have scholarships for every stage of your academic journey.' },
    ],
  },
  {
    name: 'Scholarships',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    items: [
      { q: 'How do you source scholarships?', a: 'Our team researches and verifies every scholarship listed on our platform. We partner with universities, government bodies, foundations, and private organizations to ensure accurate and up-to-date information.' },
      { q: 'How often are new scholarships added?', a: 'We add new scholarships weekly. You can set up email alerts to be notified when opportunities matching your profile become available.' },
      { q: 'Can I apply for multiple scholarships at once?', a: 'Absolutely. In fact, we recommend applying to as many scholarships as you qualify for to maximize your chances.' },
    ],
  },
  {
    name: 'Account & Privacy',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    items: [
      { q: 'How is my personal data protected?', a: 'We use industry-standard encryption, secure servers, and comply with data protection regulations. Your data is never sold to third parties. Read our full Privacy Policy for details.' },
      { q: 'I forgot my password. How do I reset it?', a: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a secure link to create a new password.' },
      { q: 'Can I delete my account?', a: 'Yes. Go to your account settings and select "Delete Account." All your data will be permanently removed within 30 days.' },
    ],
  },
  {
    name: 'Services',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    items: [
      { q: 'What does the free resume review include?', a: 'Our free review covers grammar, spelling, formatting, and basic structure. For a deep structural edit or full rewrite, explore our paid tiers.' },
      { q: 'How do I book a consulting session?', a: 'Create an account, navigate to the Admission Consulting section, and select "Book Free Discovery Call" to schedule your initial 15-minute session.' },
      { q: 'What is the essay editing turnaround time?', a: 'Proofread: 48 hours. Structural Edit: 24 hours. Full Rewrite: 12 hours. All times apply after we receive your draft.' },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      <Section background="blue" padding="py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Find answers to the most common questions about Scholarships Hub, our scholarships, and our services.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {faqCategories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === i
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                </svg>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            {faqCategories.map((cat, i) => (
              activeCategory === i && (
                <div key={i} className="space-y-3">
                  {cat.items.map((item, j) => {
                    const key = `${i}-${j}`;
                    const isOpen = openItems[key];
                    return (
                      <div key={j} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                          <svg
                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            ))}
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 mb-6">Can't find what you're looking for? Our support team is ready to help.</p>
            <a href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </a>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
