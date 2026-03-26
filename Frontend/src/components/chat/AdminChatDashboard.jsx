// src/components/chat/AdminChatDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import chatService from '../../services/chatService';
import { ChatWindow } from './ChatWindow';
import { ConversationList } from './ConversationList';
import './AdminChatDashboard.css';

export const AdminChatDashboard = () => {
  const { user } = useAuth();
  const { authenticateSocket, isConnected } = useChat();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Authenticate socket with user token
    const token = localStorage.getItem('accessToken');
    if (token) {
      authenticateSocket(token);
    }

    // Load admin stats
    loadStats();
  }, [user, authenticateSocket]);

  const loadStats = async () => {
    try {
      const response = await chatService.getAdminStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="unauthorized">You are not authorized to access this page</div>;
  }

  return (
    <div className="admin-chat-dashboard">
      <div className="dashboard-header">
        <h2>Admin Chat Dashboard</h2>
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {!loading && stats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h4>Active Conversations</h4>
            <p className="stat-value">{stats.activeConversations}</p>
          </div>
          <div className="stat-card">
            <h4>Unread Messages</h4>
            <p className="stat-value">{stats.unreadMessages}</p>
          </div>
          <div className="stat-card">
            <h4>Total Messages</h4>
            <p className="stat-value">{stats.totalMessages}</p>
          </div>
          <div className="stat-card">
            <h4>Closed Conversations</h4>
            <p className="stat-value">{stats.closedConversations}</p>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <div className="conversations-panel">
          <ConversationList onSelectConversation={setSelectedConversation} adminMode={true} />
        </div>

        <div className="chat-panel">
          {selectedConversation ? (
            <ChatWindow conversationId={selectedConversation} adminMode={true} />
          ) : (
            <div className="no-selection">Select a conversation to start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
};
