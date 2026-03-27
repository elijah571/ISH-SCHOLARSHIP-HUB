// src/components/chat/ConversationList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import chatService from '../../services/chatService';
import './ConversationList.css';

export const ConversationList = ({ onSelectConversation, adminMode = false }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = adminMode
        ? await chatService.getAdminConversations(page)
        : await chatService.getUserConversations(page);

      setConversations(response.data.data || []);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [adminMode, page]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

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

  const handleNewConversation = async () => {
    if (!newSubject.trim()) return;
    try {
      const response = await chatService.createOrGetConversation(null, newSubject.trim());
      setShowNewModal(false);
      setNewSubject('');
      onSelectConversation(response.data.data._id);
      loadConversations();
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to start conversation');
    }
  };

  return (
    <div className="conversation-list">
      <div className="list-header">
        <div className="flex justify-between items-center mb-3">
          <h3>{adminMode ? 'Admin Conversations' : 'Your Conversations'}</h3>
          {!adminMode && (
            <button
              onClick={() => setShowNewModal(true)}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + New
            </button>
          )}
        </div>
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

      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Start New Conversation</h3>
            <input
              type="text"
              placeholder="What do you need help with?"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowNewModal(false); setNewSubject(''); }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleNewConversation}
                disabled={!newSubject.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
