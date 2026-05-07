import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';

const sections = [
  {
    title: '1. Agreement to Terms',
    content: `By accessing or using Scholarships Hub ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Platform.

We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the updated Terms.`,
  },
  {
    title: '2. Eligibility',
    content: `You must be at least 16 years of age to use this Platform. By using our services, you represent that you meet this requirement. Users under 18 should have parental or guardian consent to create an account.`,
  },
  {
    title: '3. Account Responsibilities',
    content: `• You are responsible for maintaining the confidentiality of your account credentials.
• You agree to provide accurate and complete information during registration.
• You are responsible for all activity that occurs under your account.
• You must notify us immediately of any unauthorized access or security breach.
• We reserve the right to suspend or terminate accounts that violate these Terms.`,
  },
  {
    title: '4. Platform Services',
    content: `Scholarships Hub provides:
• A searchable database of scholarship opportunities
• Application guidance and resources
• Resume review, essay editing, and consulting services
• Chat support and communication tools

We strive to keep all information accurate and up to date, but we do not guarantee the completeness or accuracy of scholarship listings, deadlines, or requirements. Always verify details with the official scholarship provider.`,
  },
  {
    title: '5. User Conduct',
    content: `You agree not to:
• Use the Platform for any illegal or unauthorized purpose
• Impersonate any person or entity, or misrepresent your affiliation
• Upload content containing malware, spam, or harmful code
• Scrape, crawl, or extract data from the Platform without authorization
• Share another user's personal information without consent
• Disrupt or interfere with the Platform's functionality`,
  },
  {
    title: '6. Intellectual Property',
    content: `All content on the Platform — including text, graphics, logos, images, and software — is the property of Scholarships Hub or its licensors and is protected by intellectual property laws.

You retain ownership of content you upload (essays, resumes, etc.) but grant us a non-exclusive license to use, display, and process that content solely for the purpose of providing our services to you.`,
  },
  {
    title: '7. Limitation of Liability',
    content: `Scholarships Hub is a platform that connects students with scholarship opportunities. We do not guarantee that you will receive or win any scholarship.

To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including but not limited to lost opportunities, data loss, or scholarship application outcomes.`,
  },
  {
    title: '8. Termination',
    content: `We may terminate or suspend your access to the Platform at any time, with or without cause and without notice. Upon termination, your right to use the Platform ceases immediately. You may request deletion of your account and associated data at any time.`,
  },
  {
    title: '9. Governing Law',
    content: `These Terms are governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the Platform shall be resolved through good-faith negotiation, and if necessary, through appropriate legal channels.`,
  },
  {
    title: '10. Contact',
    content: `For questions about these Terms of Service, contact us at:
legal@scholarshipshub.com

Last updated: May 5, 2026`,
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      <Section background="blue" padding="py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              These terms govern your use of Scholarships Hub. Please read them carefully before using our platform.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="py-16">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">{s.content}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
