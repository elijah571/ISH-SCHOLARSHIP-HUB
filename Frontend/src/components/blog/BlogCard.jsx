import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card';

const BlogCard = ({ post }) => {
  const { _id, id, title, content, author, createdAt, category, readTime, imageUrl, image } = post;
  const excerpt = post.excerpt || (content ? content.replace(/[#*`]/g, '').slice(0, 150) + '…' : '');
  const displayImage = imageUrl || image;
  const date = post.date || (createdAt ? new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
  const postId = _id || id;

  const categoryColors = {
    academic: 'bg-blue-100 text-blue-800',
    scholarship: 'bg-green-100 text-green-800',
    career: 'bg-purple-100 text-purple-800',
    tips: 'bg-orange-100 text-orange-800'
  };

  return (
    <Card className="overflow-hidden group">
    <Link to={`/blog/${postId}`} className="block overflow-hidden">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <Card.Content>
        {category && (
          <Link to={`/blog?category=${category}`}>
            <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${categoryColors[category] || 'bg-gray-100 text-gray-800'} mb-3`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </Link>
        )}

        <Link to={`/blog/${postId}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-blue-600 font-medium text-xs">
                {author?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <span className="font-medium text-gray-700">{author?.name || 'Admin'}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime}
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          {date}
        </div>
      </Card.Content>
    </Card>
  );
};

export default BlogCard;
