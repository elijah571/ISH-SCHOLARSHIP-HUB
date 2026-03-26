// src/pages/ChatPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminChatDashboard } from '../components/chat/AdminChatDashboard';
import { ConversationList } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { useState } from 'react';

export const ChatPage = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);

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
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: '20px', padding: '20px' }}>
      <div style={{ flex: '0 0 30%', minWidth: 0 }}>
        <ConversationList onSelectConversation={setSelectedConversation} adminMode={false} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {selectedConversation ? (
          <ChatWindow conversationId={selectedConversation} adminMode={false} />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: 'white',
              borderRadius: '8px',
            }}
          >
            <p style={{ color: '#999' }}>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};
