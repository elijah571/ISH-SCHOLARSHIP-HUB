// src/components/chat/ConversationList.jsx
import React, { useState, useEffect } from 'react';
import chatService from '../../services/chatService';
import './ConversationList.css';

export const ConversationList = ({ onSelectConversation, adminMode = false }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadConversations();
  }, [page, adminMode]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = adminMode
        ? await chatService.getAdminConversations(page)
        : await chatService.getUserConversations(page);

      setConversations(response.data.data);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      loadConversations();
      return;
    }

    if (!adminMode) return;

    try {
      const response = await chatService.searchConversations(query);
      setConversations(response.data.data);
    } catch (err) {
      console.error('Error searching conversations:', err);
    }
  };

  return (
    <div className="conversation-list">
      <div className="list-header">
        <h3>{adminMode ? 'Admin Conversations' : 'Your Conversations'}</h3>
        {adminMode && (
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        )}
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="conversations">
        {conversations.length === 0 ? (
          <div className="no-conversations">No conversations yet</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              className="conversation-item"
              onClick={() => onSelectConversation(conv._id)}
            >
              <div className="conversation-header">
                <h4>{adminMode ? conv.participant.fullName : conv.admin.fullName}</h4>
                <span className="conversation-time">
                  {new Date(conv.lastMessageTime).toLocaleDateString()}
                </span>
              </div>
              <p className="conversation-preview">{conv.lastMessage || 'No messages yet'}</p>
              <div className="conversation-footer">
                <span className={`status ${conv.status}`}>{conv.status}</span>
                {adminMode && conv.adminUnread > 0 && (
                  <span className="unread-badge">{conv.adminUnread}</span>
                )}
                {!adminMode && conv.participantUnread > 0 && (
                  <span className="unread-badge">{conv.participantUnread}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};
