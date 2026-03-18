import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import { AuthFooter } from './RegisterPage';
import api from '../services/api';

const CheckCircleIcon = () => (
  <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ErrorCircleIcon = () => (
  <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing. Please check your email link.');
        return;
      }

      try {
        const { data } = await api.get('/api/auth/verify-email', {
          params: { token },
        });
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(
          err.response?.data?.message || 'Verification failed. The link may be invalid or expired.'
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar buttonText="Log in" buttonLink="/login" />

      <main className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-[420px] bg-white rounded-xl p-8 shadow-sm text-center">
          {status === 'loading' && (
            <>
              <div className="mb-6 flex justify-center">
                <SpinnerIcon />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying your email...
              </h2>
              <p className="text-sm text-gray-500">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-6 flex justify-center">
                <CheckCircleIcon />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verified!
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {message}
              </p>
              <Link to="/login">
                <Button className="w-full h-11 text-[14px] font-semibold">
                  Continue to Login
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-6 flex justify-center">
                <ErrorCircleIcon />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-sm text-red-500 mb-6">
                {message}
              </p>
              <Link to="/register">
                <Button variant="outline" className="w-full h-11 text-[14px] font-medium">
                  Back to Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default VerifyEmailPage;
