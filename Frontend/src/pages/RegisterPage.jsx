import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import api from '../services/api';


// ICONS AS SVGS
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

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

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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

const GraduationCapIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const TriangleLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
    <path d="M16 4L28 28H4L16 4Z" fill="#2563EB" />
    <path d="M16 10L22 24H10L16 10Z" fill="white" fillOpacity="0.9" />
  </svg>
);

const GlobeIllustration = () => (
  <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
    <circle cx="200" cy="200" r="180" stroke="#2563EB" strokeWidth="2" fill="none" opacity="0.3" />
    <circle cx="200" cy="200" r="140" stroke="#2563EB" strokeWidth="1.5" fill="none" opacity="0.2" />
    <circle cx="200" cy="200" r="100" stroke="#2563EB" strokeWidth="1" fill="none" opacity="0.15" />
    <ellipse cx="200" cy="200" rx="180" ry="60" stroke="#2563EB" strokeWidth="1.5" fill="none" opacity="0.2" />
    <ellipse cx="200" cy="200" rx="180" ry="120" stroke="#2563EB" strokeWidth="1" fill="none" opacity="0.15" />
    <ellipse cx="200" cy="200" rx="60" ry="180" stroke="#2563EB" strokeWidth="1.5" fill="none" opacity="0.2" />
    <ellipse cx="200" cy="200" rx="100" ry="180" stroke="#2563EB" strokeWidth="1" fill="none" opacity="0.15" />
    <path d="M40 200H360" stroke="#2563EB" strokeWidth="1" opacity="0.1" />
    <path d="M200 20V380" stroke="#2563EB" strokeWidth="1" opacity="0.1" />
  </svg>
);

// const Navbar = () => {
//   const navLinks = [
//     { name: 'Find Scholarships', href: '/scholarships' },
//     { name: 'University Guide', href: '#' },
//     { name: 'Resources', href: '#' }
//   ];

//   return (
//     <nav className="h-[72px] bg-white border-b border-slate-200">
//       <div className="flex items-center justify-between h-full px-[60px]">
//         <div className="flex items-center gap-[10px]">
//           <TriangleLogo />
//           <span className="text-[18px] font-semibold text-slate-900">Scholarship Hub</span>
//         </div>

//         <div className="hidden md:flex items-center gap-[28px]">
//           {navLinks.map((link) => (
//             <Link
//               key={link.name}
//               to={link.href}
//               className="text-[14px] font-medium text-slate-600 hover:text-blue-600 transition-colors"
//             >
//               {link.name}
//             </Link>
//           ))}
//         </div>

//         <div>
//           <Link to="/login">
//             <Button className="px-[18px] py-2 text-[14px] font-semibold">
//               Log in
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

export const AuthFooter = () => {
  return (
    <footer className="h-14 bg-slate-50 border-t border-slate-200">
      <div className="flex items-center justify-between h-full px-[60px]">
        <p className="text-[12px] text-slate-500">
          © {new Date().getFullYear()} Scholarship Hub. Empowering the next generation of global leaders.
        </p>
        <div className="flex items-center gap-5">
          <Link to="#" className="text-[12px] text-slate-500 hover:text-slate-700">Privacy Policy</Link>
          <Link to="#" className="text-[12px] text-slate-500 hover:text-slate-700">Terms of Use</Link>
          <Link to="#" className="text-[12px] text-slate-500 hover:text-slate-700">Help Center</Link>
        </div>
      </div>
    </footer>
  );
};

const IconInput = ({ icon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === 'password';

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10">
        {icon}
      </div>
      <input
        {...props}
        type={isPassword && showPassword ? 'text' : props.type}
        className={`w-full h-11 border border-slate-200 rounded-lg pl-10 pr-10 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${props.className || ''}`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
};

const IconSelect = ({ options = [], ...props }) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10">
        {/* <Icon /> */}
      </div>
      <select
        {...props}
        className="w-full h-11 border border-slate-200 rounded-lg pl-10 pr-9 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
      >
        <option value="">{props.placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <ChevronDownIcon />
      </div>
    </div>
  );
};

const SocialProof = () => {
  const avatars = [1, 2, 3];
  return (
    <div className="flex items-center">
      <div className="flex">
        {avatars.map((i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full border-2 border-white bg-slate-300 -ml-2 first:ml-0"
          />
        ))}
      </div>
      <span className="text-[14px] text-blue-600 font-medium ml-3">
        +5,000 students joined this week
      </span>
    </div>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    degreeLevel: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      setIsSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Success view: "Check your email" ───
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar buttonText="Log in" buttonLink="/login" />
        <main className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
          <div className="w-full max-w-[420px] bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="mb-6 flex justify-center">
              <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
            <p className="text-sm text-slate-500 mb-6">
              We've sent a verification link to <span className="font-medium text-slate-700">{formData.email}</span>.
              Please click the link to verify your account.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full h-11 text-[14px] font-medium">
                Continue to Login
              </Button>
            </Link>
          </div>
        </main>
        <AuthFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
      buttonText="Log in"
      buttonLink="/login"
      />

      <main className="flex-1 flex">
        <div className="hidden lg:flex lg:w-1/2 bg-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
            <div className="w-[600px] h-[600px]">
              <GlobeIllustration />
            </div>
          </div>

          <div className="relative z-10 flex flex-col justify-center pl-[80px] pr-[60px] py-[100px]">
            <div className="max-w-[520px]">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-8">
                <GraduationCapIcon />
              </div>

              <h1 className="text-[52px] font-bold text-slate-900 leading-tight mb-5">
                Your Journey to
                <br />
                Global Education
                <br />
                Starts Here.
              </h1>

              <p className="text-[16px] text-slate-600 leading-relaxed mb-8 max-w-[420px]">
                Join thousands of students finding fully-funded opportunities worldwide.
                Access exclusive databases and expert guides today.
              </p>

              <SocialProof />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 py-12 lg:px-[100px]">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <h2 className="text-[28px] font-bold text-slate-900 mb-2">
                Create your account
              </h2>
              <p className="text-[14px] text-slate-500">
                Fill in your details to get started with your scholarship search.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mb-[18px]">
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <IconInput
                  icon={<UserIcon />}
                  placeholder="Jane Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="mb-[18px]">
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <IconInput
                  icon={<EnvelopeIcon />}
                  type="email"
                  placeholder="jane@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5 mb-[18px]">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <IconInput
                    icon={<LockIcon />}
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <IconInput
                    icon={<LockRefreshIcon />}
                    type="password"
                    placeholder="Confirm"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mt-2 mb-5">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[13px] text-slate-500">
                    I agree to the{' '}
                    <Link to="#" className="text-blue-600 font-medium hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="#" className="text-blue-600 font-medium hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-[15px] font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <p className="text-center text-[13px] text-slate-500 mt-5">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-medium hover:underline">
                  Log in
                </Link>
              </p>

              <p className="text-[10px] text-slate-300 text-center tracking-[2px] mt-6">
                TRUSTED BY GLOBAL UNIVERSITIES
              </p>
            </form>
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default RegisterPage;
