import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useScholarships } from '../context/ScholarshipContext';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const ScholarshipDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentScholarship, loading, error, fetchScholarshipById } = useScholarships();
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchScholarshipById(id);
    }
  }, [id, fetchScholarshipById]);

  const formatDeadline = (date) => {
    if (!date) return 'Not specified';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/scholarships/${id}`);
      return;
    }
    if (currentScholarship.link) {
      window.open(currentScholarship.link, '_blank');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/scholarships/${id}`);
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await userService.unsaveScholarship(id);
        setIsSaved(false);
        toast.success('Removed from saved scholarships');
      } else {
        await userService.saveScholarship(id);
        setIsSaved(true);
        toast.success('Saved scholarship successfully');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update saved status.';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar buttonText="Apply" buttonLink="/login" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !currentScholarship) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar buttonText="Apply" buttonLink="/login" />
        <Section padding="py-20">
          <Container>
            <div className="text-center">
              <svg
                className="w-20 h-20 mx-auto text-gray-400 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Scholarship Not Found</h2>
              <p className="text-gray-600 mb-6">
                {error || 'The scholarship you are looking for does not exist or has been removed.'}
              </p>
              <Button onClick={() => navigate('/scholarships')}>Browse Scholarships</Button>
            </div>
          </Container>
        </Section>
        <Footer />
      </div>
    );
  }

  const imageUrl =
    currentScholarship.image?.url ||
    currentScholarship.image ||
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop';
  const deadlinePassed = isExpired(currentScholarship.deadline);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar buttonText="Apply" buttonLink="/login" />

      <div className="relative h-72 md:h-80">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/60" />
        </div>

        <div className="absolute bottom-[-40px] left-4 md:left-10 right-4 md:right-auto md:w-[70%] max-w-3xl">
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-5 md:p-6 text-white border border-white/20">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
                deadlinePassed ? 'bg-red-500' : 'bg-emerald-500'
              }`}
            >
              {deadlinePassed
                ? 'CLOSED'
                : currentScholarship.funding_type?.toUpperCase() || 'SCHOLARSHIP'}
            </span>

            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-2 break-words">
              {currentScholarship.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-5 text-white/90 text-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {currentScholarship.country}
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Deadline: {formatDeadline(currentScholarship.deadline)}
              </div>
              {currentScholarship.duration && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {currentScholarship.duration}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />

      <Section padding="pb-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-7">
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Information</h3>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1">
                    <span className="text-gray-500 text-sm">Funding Type</span>
                    <span className="text-emerald-600 font-semibold text-sm text-left sm:text-right">
                      {currentScholarship.funding_type || 'Not specified'}
                    </span>
                  </div>
                  {currentScholarship.duration && (
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1">
                      <span className="text-gray-500 text-sm">Duration</span>
                      <span className="text-gray-900 font-medium text-sm">
                        {currentScholarship.duration}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1">
                    <span className="text-gray-500 text-sm">Country</span>
                    <span className="text-gray-900 font-medium text-sm">
                      {currentScholarship.country}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1">
                    <span className="text-gray-500 text-sm">Deadline</span>
                    <span
                      className={`font-medium text-sm ${deadlinePassed ? 'text-red-600' : 'text-gray-900'}`}
                    >
                      {formatDeadline(currentScholarship.deadline)}
                    </span>
                  </div>
                </div>

                {currentScholarship.link && (
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <a
                      href={currentScholarship.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2.5 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Visit Official Website
                    </a>
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Share This Opportunity
                  </p>
                  <div className="flex gap-2.5">
                    <button className="w-10 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                    <button className="w-10 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </button>
                    <button className="w-10 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(window.location.href);
                          toast.success('Link copied to clipboard.');
                        } catch {
                          toast.error('Failed to copy link.');
                        }
                      }}
                      className="w-10 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1.5">Need Help Applying?</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Our team of experts can guide you through the application process and help you
                  maximize your chances of success.
                </p>
                <Link
                  to="/contact"
                  className="text-blue-600 font-medium text-sm mt-2 inline-block hover:underline"
                >
                  Contact Us →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Overview</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line break-words">
                  {currentScholarship.description}
                </p>
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {deadlinePassed ? (
                  <Button disabled className="opacity-50 cursor-not-allowed">
                    Applications Closed
                  </Button>
                ) : (
                  <Button onClick={handleApply} className="px-6">
                    {isAuthenticated ? 'Apply Now' : 'Sign in to Apply'}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className={`w-4 h-4 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`}
                      fill={isSaved ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  )}
                  <span>{isSaved ? 'Saved' : 'Save for Later'}</span>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
};

export default ScholarshipDetailsPage;
