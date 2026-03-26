import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const BlogDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/api/blog/${id}`);
        setBlog(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime || 5} min read`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.content?.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar buttonText="Get Started" buttonLink="/register" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar buttonText="Get Started" buttonLink="/register" />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Post Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      <div className="bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeftIcon />
            <span className="ml-2">Back to Blogs</span>
          </Link>

          {blog.published !== undefined && (
            <span
              className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 ${
                blog.published
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {blog.published ? 'Published' : 'Draft'}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            {blog.createdBy && (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium">
                    {blog.createdBy.name?.charAt(0) || blog.createdBy.email?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {blog.createdBy.name || 'Admin'}
                  </p>
                  <p className="text-sm text-gray-500">{blog.createdBy.email}</p>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <CalendarIcon />
              <span className="ml-2">{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon />
              <span className="ml-2">{calculateReadTime(blog.content)}</span>
            </div>
          </div>
        </div>
      </div>

      {blog.image?.url && (
        <div className="max-w-5xl mx-auto px-4 -mt-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={blog.image.url}
              alt={blog.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          </div>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 py-12">
        <div
          className="prose prose-lg max-w-none"
          style={{
            lineHeight: '1.8',
          }}
        >
          {blog.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                {paragraph}
              </p>
            )
          ))}
        </div>

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ShareIcon />
            <span>Share</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
            <BookmarkIcon />
            <span>Save</span>
          </button>
        </div>
      </article>

      {blog.createdBy && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center bg-white rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-white font-bold text-xl">
                  {blog.createdBy.name?.charAt(0) || blog.createdBy.email?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {blog.createdBy.name || 'Admin'}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Content Writer at ISH Scholarship Hub
                </p>
                <p className="text-gray-600 mt-2">
                  Providing expert insights on scholarships, academic advice, and career guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BlogDetailsPage;
