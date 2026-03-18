import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';
import BlogList from '../components/blog/BlogList';
import Newsletter from '../components/Newsletter';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'academic', name: 'Academic' },
    { id: 'scholarship', name: 'Scholarships' },
    { id: 'career', name: 'Career' },
    { id: 'tips', name: 'Tips' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Top Fully Funded Scholarships for International Students 2026',
      excerpt: 'Discover the most prestigious fully funded scholarship programs that cover tuition, living expenses, and travel costs for students seeking to study abroad.',
      author: { name: 'Sarah Johnson' },
      date: 'March 15, 2026',
      category: 'scholarship',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      title: 'How to Write a Winning Scholarship Essay: Complete Guide',
      excerpt: 'Learn the secrets to crafting compelling scholarship essays that stand out. Includes examples, tips from scholarship winners, and common mistakes to avoid.',
      author: { name: 'Michael Chen' },
      date: 'March 12, 2026',
      category: 'tips',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      title: 'Computer Science vs Data Science: Which Degree is Right for You?',
      excerpt: 'A comprehensive comparison of CS and Data Science programs to help you make an informed decision about your future career path.',
      author: { name: 'Emily Davis' },
      date: 'March 10, 2026',
      category: 'academic',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      title: 'Fulbright Program Application: Everything You Need to Know',
      excerpt: 'The Fulbright Scholar Program is one of the most prestigious international academic exchange programs. Here\'s how to maximize your chances of acceptance.',
      author: { name: 'Robert Williams' },
      date: 'March 8, 2026',
      category: 'scholarship',
      readTime: '15 min read',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 5,
      title: 'Building Your Tech Portfolio: Projects That Impress Employers',
      excerpt: 'A curated list of portfolio projects that will make you stand out in tech interviews. From web apps to machine learning projects.',
      author: { name: 'Alex Thompson' },
      date: 'March 5, 2026',
      category: 'career',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 6,
      title: 'Study in Germany: A Complete Guide for International Students',
      excerpt: 'Germany offers world-class education with minimal tuition fees. Learn about admission requirements, visa process, and living costs.',
      author: { name: 'Lisa Anderson' },
      date: 'March 3, 2026',
      category: 'academic',
      readTime: '14 min read',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 7,
      title: 'Preparing for Technical Interviews at Top Tech Companies',
      excerpt: 'Master the technical interview process with these proven strategies. Covers coding challenges, system design, and behavioral questions.',
      author: { name: 'David Kim' },
      date: 'March 1, 2026',
      category: 'career',
      readTime: '11 min read',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 8,
      title: 'Chevening vs Rhodes Scholarship: A Detailed Comparison',
      excerpt: 'Compare two of the most prestigious scholarship programs in the world. Find out which one aligns better with your academic goals.',
      author: { name: 'Rachel Green' },
      date: 'February 28, 2026',
      category: 'scholarship',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 9,
      title: 'How to Balance Studies and Part-Time Work as an International Student',
      excerpt: 'Practical tips for managing your time effectively while working part-time during your studies. Maximize your experience without compromising grades.',
      author: { name: 'James Wilson' },
      date: 'February 25, 2026',
      category: 'tips',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
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

          <BlogList posts={filteredPosts} loading={false} />

          {filteredPosts.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Showing {filteredPosts.length} of {blogPosts.length} articles
              </p>
            </div>
          )}
        </Container>
      </Section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default BlogPage;
