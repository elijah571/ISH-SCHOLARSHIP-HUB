import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from './Layout';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';

const Navbar = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const response = await chatService.getUserConversations(1, 50);
      const conversations = response.data.data || [];
      const totalUnread = conversations.reduce((sum, conv) => sum + (conv.participantUnread || 0), 0);
      setUnreadCount(totalUnread);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Scholarships', to: '/scholarships' },
    { name: 'Blogs', to: '/blog' },
    { name: 'Internships', to: '/internships' },
    { name: 'Chat', to: '/chat', showBadge: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-18 md:h-20">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-900">Scholarships Hub</span>
          </div>

          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200 relative"
              >
                {link.name}
                {link.name === 'Chat' && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Welcome, <span className="text-blue-600">{user?.fullName?.split(' ')[0] || 'User'}</span>
                  </span>
                  <Link to="/dashboard">
                    <Button rounded="md" variant="outline" className="px-5">
                      Dashboard
                    </Button>
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button rounded="md" variant="outline" className="px-5">
                    Log In
                  </Button>
                </Link>
                <Link to={props.buttonLink}>
                  <Button rounded="md" className="px-6">
                    {props.buttonText}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200 py-2 flex items-center gap-2"
                >
                  {link.name}
                  {link.showBadge && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2">
                    <span className="text-sm font-medium text-gray-700">
                      Welcome, <span className="text-blue-600">{user?.fullName?.split(' ')[0] || 'User'}</span>
                    </span>
                  </div>
                  <Link to="/dashboard">
                    <Button rounded="md" className="mt-2 w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/chat">
                    <Button rounded="md" className="mt-2 w-full">
                      💬 Chat
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button rounded="md" variant="outline" className="mt-2 w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to={props.buttonLink}>
                    <Button rounded="md" className="mt-2 w-full">
                      {props.buttonText}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;