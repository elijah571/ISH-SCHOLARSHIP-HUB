// src/components/chat/ConversationList.jsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import chatService from '../../services/chatService';
import { useChat } from '../../context/ChatContext';
import './ConversationList.css';

export const ConversationList = ({
  onSelectConversation,
  selectedConversationId = null,
  adminMode = false,
}) => {
  const { latestConversationActivity } = useChat();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, hasMore: false });
  const [showNewModal, setShowNewModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const hasBootstrappedConversation = useRef(false);

  const formatConversationTime = (value) => {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const isSameDay = date.toDateString() === now.toDateString();

    if (isSameDay) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = adminMode
        ? await chatService.getAdminConversations(page)
        : await chatService.getUserConversations(page);

      const loadedConversations = response.data.data || [];
      const paginationData = response.data.pagination || {
        currentPage: page,
        totalPages: 1,
        hasMore: false,
      };

      setConversations(loadedConversations);
      setPagination(paginationData);

      if (loadedConversations.length > 0) {
        const selectedStillExists = loadedConversations.some(
          (conversation) => conversation._id === selectedConversationId
        );

        if (!selectedConversationId || !selectedStillExists) {
          onSelectConversation(loadedConversations[0]._id);
        }
        return loadedConversations;
      }

      if (!adminMode && !hasBootstrappedConversation.current) {
        hasBootstrappedConversation.current = true;
        const bootstrapResponse = await chatService.createOrGetConversation(null, 'Admin Support');
        const bootstrapConversationId = bootstrapResponse.data.data?._id;

        if (bootstrapConversationId) {
          onSelectConversation(bootstrapConversationId);
          return await loadConversations();
        }
      }

      return loadedConversations;
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
      return [];
    } finally {
      setLoading(false);
    }
  }, [adminMode, onSelectConversation, page, selectedConversationId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const interval = setInterval(() => {
      void loadConversations();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadConversations]);

  useEffect(() => {
    if (!latestConversationActivity?.conversationId) {
      return;
    }

    void loadConversations();
  }, [latestConversationActivity, loadConversations]);

  const visibleConversations = useMemo(() => conversations, [conversations]);

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
      const searchedConversations = response.data.data || [];
      setConversations(searchedConversations);

      if (searchedConversations.length > 0 && !selectedConversationId) {
        onSelectConversation(searchedConversations[0]._id);
      }
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
      await loadConversations();
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
        {visibleConversations.length === 0 ? (
          <div className="no-conversations">
            <div className="no-conversations-title">No conversations yet</div>
            <p>{adminMode ? 'New user messages will appear here.' : 'Start a support chat to message the admin team.'}</p>
          </div>
        ) : (
          visibleConversations.map((conv) => {
            const otherPerson = adminMode ? conv.participant : conv.admin;
            const unreadCount = adminMode ? conv.adminUnread : conv.participantUnread;
            const displayName = otherPerson?.fullName || (adminMode ? 'Student' : 'Support');
            const avatarText = displayName.charAt(0).toUpperCase();
            const previewText = conv.lastMessage || conv.subject || 'Start the conversation';

            return (
            <div
              key={conv._id}
              className={`conversation-item ${selectedConversationId === conv._id ? 'active' : ''}`}
              onClick={() => onSelectConversation(conv._id)}
            >
              <div className="conversation-avatar">{avatarText}</div>
              <div className="conversation-body">
                <div className="conversation-header">
                  <h4>{displayName}</h4>
                  <span className="conversation-time">
                    {formatConversationTime(conv.lastMessageTime || conv.updatedAt)}
                  </span>
                </div>
                <div className="conversation-meta">
                  <p className="conversation-preview">{previewText}</p>
                  {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                </div>
                <div className="conversation-footer">
                  <span className={`status ${conv.status || 'active'}`}>{conv.status || 'active'}</span>
                  {adminMode && otherPerson?.email && (
                    <span className="conversation-email">{otherPerson.email}</span>
                  )}
                </div>
              </div>
            </div>
          );
          })
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= (pagination.totalPages || 1)}
        >
          Next
        </button>
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
