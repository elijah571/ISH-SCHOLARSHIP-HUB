import React, { useState } from 'react';
import { Container, Section } from './Layout';
import Button from './Button';
import { Input } from './Input';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribing with email:', email);
    setEmail('');
  };

  return (
    <Section padding="py-16">
      <Container>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Never miss an opportunity
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Subscribe to our newsletter and get the latest scholarships and opportunities delivered directly to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-blue-50/20 border-blue-200 text-white placeholder-blue-200 h-12"
                required
              />
              <Button 
                type="submit"
                variant="white"
                rounded="full"
                className="px-8 h-12 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Newsletter;