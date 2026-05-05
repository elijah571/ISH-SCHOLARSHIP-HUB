import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';

const sections = [
  {
    title: '1. Introduction',
    content: `Scholarships Hub ("we", "our", or "us") operates the scholarshipshub.com platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our services.

By accessing or using our platform, you agree to the practices described in this policy. If you do not agree, please discontinue use of our services.`,
  },
  {
    title: '2. Information We Collect',
    content: `We collect information you provide directly, such as:
• Account details (name, email, password)
• Academic profile (education level, field of study, GPA)
• Scholarship applications and preferences
• Communications with our support team
• Uploaded documents (resumes, essays, transcripts)

We also automatically collect:
• Browser type and version
• Device information and operating system
• IP address and approximate location
• Pages visited and time spent on our platform
• Referral source`,
  },
  {
    title: '3. How We Use Your Information',
    content: `Your information is used to:
• Create and manage your account
• Match you with relevant scholarship opportunities
• Provide personalized recommendations
• Process service requests (essay editing, consulting)
• Send important account notifications and updates
• Improve our platform and services
• Prevent fraud and ensure platform security

We do not sell, trade, or rent your personal information to third parties.`,
  },
  {
    title: '4. Data Sharing & Disclosure',
    content: `We may share your information only in the following circumstances:
• With your explicit consent (e.g., sharing your profile with a scholarship provider)
• With service providers who assist in operating our platform (hosting, email delivery, payment processing) — all bound by confidentiality agreements
• When required by law, regulation, or legal process
• To protect the rights, property, or safety of Scholarships Hub, our users, or the public`,
  },
  {
    title: '5. Data Security',
    content: `We implement industry-standard security measures to protect your personal information:
• Encryption in transit (TLS/SSL) and at rest (AES-256)
• Regular security audits and vulnerability assessments
• Access controls and role-based permissions
• Secure password hashing using Argon2
• Regular backups with disaster recovery procedures

While we take reasonable precautions, no system is completely secure. We cannot guarantee absolute protection of your data.`,
  },
  {
    title: '6. Your Rights',
    content: `You have the right to:
• Access your personal data stored in our systems
• Request correction of inaccurate information
• Request deletion of your account and associated data
• Export your data in a portable format
• Withdraw consent for marketing communications at any time
• Opt out of non-essential cookies

To exercise these rights, contact us at privacy@scholarshipshub.com.`,
  },
  {
    title: '7. Cookies & Tracking',
    content: `We use essential cookies for authentication and session management. Optional analytics cookies help us understand how users interact with our platform. You can manage cookie preferences through your browser settings. Disabling essential cookies may limit platform functionality.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Significant changes will be communicated via email or platform notification. Continued use of our services after changes constitutes acceptance of the updated policy.

Last updated: May 5, 2026`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      <Section background="blue" padding="py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Your privacy matters to us. This policy outlines how we collect, use, and protect your personal information.
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
