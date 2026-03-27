// src/pages/ChatPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminChatDashboard } from '../components/chat/AdminChatDashboard';
import { ConversationList } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { MessageIcon } from '../components/icons/Icons';
import { useChat } from '../context/ChatContext';
import { getAccessToken } from '../services/api';
import { useState, useEffect } from 'react';

export const ChatPage = () => {
  const { user } = useAuth();
  const { authenticateSocket } = useChat();
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      const token = getAccessToken();
      if (token) {
        authenticateSocket(token);
      }
    }
  }, [user, authenticateSocket]);

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Please log in to access chat</p>
      </div>
    );
  }

  if (user.role === 'admin') {
    return <AdminChatDashboard />;
  }

  // User chat interface
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col p-6">
      <div className="flex-1 w-full max-w-[1400px] mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex h-full min-h-[600px]">
          <div className="w-80 border-r border-gray-200 bg-gray-50/30">
            <ConversationList
              onSelectConversation={setSelectedConversation}
              selectedConversationId={selectedConversation}
              adminMode={false}
            />
          </div>
          <div className="flex-1 bg-white relative">
            {selectedConversation ? (
              <ChatWindow conversationId={selectedConversation} adminMode={false} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <MessageIcon />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Your Messages</h3>
                <p className="text-sm text-gray-500">Select a conversation from the sidebar to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
