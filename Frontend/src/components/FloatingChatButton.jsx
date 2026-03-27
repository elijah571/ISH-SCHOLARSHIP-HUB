import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import { MessageIcon } from './icons/Icons';

const FloatingChatButton = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
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

  useEffect(() => {
    setIsVisible(location.pathname !== '/chat' && location.pathname !== '/dashboard');
  }, [location.pathname]);

  if (!isAuthenticated || !isVisible || unreadCount === 0) {
    return null;
  }

  return (
    <Link
      to="/chat"
      className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
      title="You have unread messages"
    >
      <div className="relative">
        <MessageIcon />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      </div>
    </Link>
  );
};

export default FloatingChatButton;
