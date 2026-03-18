import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import { AuthFooter } from './RegisterPage';
import api from '../services/api';

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const LockRefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10h4m-2 2v4" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconInput = ({ icon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === 'password';

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
        {icon}
      </div>
      <input
        {...props}
        type={isPassword && showPassword ? 'text' : props.type}
        className={`w-full h-11 border border-gray-200 rounded-lg pl-10 pr-10 text-[14px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${props.className || ''}`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
};

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/api/auth/reset-password/${token}`, { password });
      setIsSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Password reset failed. The link may be invalid or expired.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar buttonText="Log in" buttonLink="/login" />

      <main className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-[420px]">
          {!isSuccess ? (
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Set new password
                </h2>
                <p className="text-sm text-gray-500">
                  Your new password must be different from previously used passwords.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <IconInput
                    icon={<LockIcon />}
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <IconInput
                    icon={<LockRefreshIcon />}
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 mb-4">{error}</p>
                )}

                <div className="mb-5">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <span>Password strength:</span>
                    <div className="flex gap-1">
                      <div className={`w-8 h-1 rounded ${password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      <div className={`w-8 h-1 rounded ${password.match(/[A-Z]/) ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      <div className={`w-8 h-1 rounded ${password.match(/[0-9]/) ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                    </div>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${password.match(/[A-Z]/) ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      Uppercase letter included
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${password.match(/[0-9]/) ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      Number included
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 text-[14px] font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="mb-6 flex justify-center">
                <CheckCircleIcon />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Password reset complete
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Your password has been successfully reset. You can now login with your new password.
              </p>
              <Link to="/login">
                <Button className="w-full h-11 text-[14px] font-semibold">
                  Continue to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default ResetPasswordPage;
