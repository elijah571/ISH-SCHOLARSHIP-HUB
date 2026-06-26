import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';
import BlogList from '../components/blog/BlogList';
import Newsletter from '../components/Newsletter';
import Loader from '../components/Loader';
import Pagination from '../components/scholarships/Pagination';

const LIMIT = 9;

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: LIMIT });
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const { data } = await api.get(`/api/blog?${params}`);
      const raw = data.data || [];

      setBlogs(raw.map((blog) => ({
        id: blog.id,
        title: blog.title,
        excerpt: blog.content
          ? blog.content.replace(/\*\*/g, '').substring(0, 150) + (blog.content.length > 150 ? '…' : '')
          : '',
        author: { name: blog.createdBy?.fullName || blog.createdBy?.email || 'Admin' },
        date: blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          : '',
        readTime: blog.content
          ? Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200)) + ' min read'
          : '5 min read',
        image: blog.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      })));

      if (data.pagination) {
        setPagination({ total: data.pagination.total, totalPages: data.pagination.totalPages });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Get Started" buttonLink="/register" />

      <Section background="gray" padding="py-12">
        <Container>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blogs</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert insights on scholarships, academic advice, and career guidance to help you succeed.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-5 py-3 pl-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 shadow-sm"
              />
              <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </Container>
      </Section>

      <Section padding="py-8">
        <Container>
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader size="xl" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchBlogs}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-6 flex items-center gap-3">
                  <p className="text-gray-600 text-sm">
                    {pagination.total} result{pagination.total !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSearchInput(''); setCurrentPage(1); }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              <BlogList posts={blogs} loading={false} />

              {!searchQuery && pagination.total > 0 && (
                <p className="text-center text-gray-500 text-sm mt-8">
                  Showing {Math.min((currentPage - 1) * LIMIT + 1, pagination.total)}–{Math.min(currentPage * LIMIT, pagination.total)} of {pagination.total} articles
                </p>
              )}

              {pagination.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={handlePageChange}
                    totalPages={pagination.totalPages}
                  />
                </div>
              )}
            </>
          )}
        </Container>
      </Section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default BlogPage;
