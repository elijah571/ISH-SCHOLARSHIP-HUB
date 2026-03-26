import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';
import BlogList from '../components/blog/BlogList';
import Newsletter from '../components/Newsletter';
import Loader from '../components/Loader';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'academic', name: 'Academic' },
    { id: 'scholarship', name: 'Scholarships' },
    { id: 'career', name: 'Career' },
    { id: 'tips', name: 'Tips' }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/api/blog');
        setBlogs(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load blogs');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const transformBlogForCard = (blog) => {
    const excerpt = blog.content 
      ? blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '')
      : '';
    
    const readTime = blog.content
      ? Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200)) + ' min read'
      : '5 min read';

    return {
      _id: blog._id,
      id: blog._id,
      title: blog.title,
      excerpt,
      author: { name: blog.createdBy?.name || blog.createdBy?.email || 'Admin' },
      date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
      category: 'scholarship',
      readTime,
      image: blog.image?.url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    };
  };

  const filteredPosts = blogs
    .filter(blog => blog.published)
    .map(transformBlogForCard)
    .filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        buttonText="Get Started"
        buttonLink="/register"
      />

      <Section background="gray" padding="py-12">
        <Container>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blogs
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert insights on scholarships, academic advice, and career guidance to help you succeed.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 shadow-sm"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="py-8">
        <Container>
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader size="xl" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <BlogList posts={filteredPosts} loading={false} />

              {filteredPosts.length > 0 && (
                <div className="mt-12 text-center">
                  <p className="text-gray-500 text-sm">
                    Showing {filteredPosts.length} of {blogs.filter(b => b.published).length} articles
                  </p>
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
