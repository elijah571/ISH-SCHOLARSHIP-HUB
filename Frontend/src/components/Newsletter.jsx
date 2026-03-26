import React, { useState } from 'react';
import { Container, Section } from './Layout';
import Button from './Button';
import { Input } from './Input';
import api from '../services/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/api/newsletter/subscribe', { email });
      setMessage({
        type: 'success',
        text: 'Successfully subscribed! Check your email for confirmation.'
      });
      setEmail('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to subscribe. Please try again.';
      setMessage({
        type: 'error',
        text: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setMessage({ type: '', text: '' });
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
            
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                    : 'bg-red-500/20 text-red-100 border border-red-400/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{message.text}</span>
                  <button
                    onClick={handleDismiss}
                    className="ml-4 text-white/70 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

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
                rounded="md"
                disabled={loading}
                className="px-8 h-12 whitespace-nowrap disabled:opacity-60"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Newsletter;
