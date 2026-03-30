import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chatService';
import './ChatWindow.css';

export const ChatWindow = ({ conversationId, adminMode = false }) => {
  const { user } = useAuth();
  const {
    messages,
    typingUsers,
    setMessages,
    clearMessages,
    joinConversation,
    leaveConversation,
    markAsRead,
    sendMessage,
    editMessage,
    deleteMessage,
    notifyTyping,
    notifyStopTyping,
  } = useChat();
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        clearMessages();
        const [conversationResponse, messagesResponse] = await Promise.all([
          chatService.getConversation(conversationId),
          chatService.getMessages(conversationId),
        ]);
        if (!cancelled) {
          setConversation(conversationResponse.data.data || null);
          setMessages(messagesResponse.data.data || []);
          joinConversation(conversationId);
          markAsRead(conversationId);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading messages:', error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
      if (conversationId) {
        leaveConversation(conversationId);
      }
    };
  }, [clearMessages, conversationId, joinConversation, leaveConversation, markAsRead, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    if (editingMessageId) {
      editMessage(editingMessageId, messageText);
      setEditingMessageId(null);
    } else {
      sendMessage(conversationId, messageText);
    }

    setMessageText('');
    notifyStopTyping(conversationId);
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    notifyTyping(conversationId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      notifyStopTyping(conversationId);
    }, 3000);
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message._id);
    setMessageText(message.message);
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(messageId, conversationId);
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setMessageText('');
  };

  const currentUserId = user?.id || user?._id;
  const otherPerson = adminMode ? conversation?.participant : conversation?.admin;
  const headerTitle = otherPerson?.fullName || (adminMode ? 'Student conversation' : 'Support team');
  const headerSubtitle = typingUsers.length > 0
    ? typingUsers.map((typingUser) => typingUser.userName).join(', ') + ' typing...'
    : otherPerson?.email || conversation?.subject || 'Secure support chat';

  const formatTime = (value) =>
    new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-window-avatar">
          {(headerTitle || '?').charAt(0).toUpperCase()}
        </div>
        <div className="chat-window-heading">
          <h3>{headerTitle}</h3>
          <p>{headerSubtitle}</p>
        </div>
      </div>

      <div className="chat-messages">
        {isLoading ? (
          <div className="loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-title">No messages yet</div>
            <p>Send a message to start this conversation.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={`message-row ${msg.sender?._id === currentUserId ? 'outgoing' : 'incoming'}`}>
              <div className={`message ${msg.sender?._id === currentUserId ? 'outgoing' : 'incoming'}`}>
                <div className="message-content">
                  {msg.isDeleted ? '(Message deleted)' : msg.message}
                </div>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="attachments">
                    {msg.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {att.name}
                      </a>
                    ))}
                  </div>
                )}
                <div className="message-meta">
                  {msg.editedAt && !msg.isDeleted && (
                    <span className="edited-label">edited</span>
                  )}
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                  {msg.isRead && msg.sender?._id === currentUserId && <span className="read-indicator">Seen</span>}
                </div>
                {msg.sender?._id === currentUserId && !msg.isDeleted && (
                  <div className="message-actions">
                    <button onClick={() => handleEditMessage(msg)} title="Edit message">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteMessage(msg._id)} title="Delete message">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.map((user) => (
              <span key={user.userId}>{user.userName} is typing...</span>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        {editingMessageId && (
          <div className="editing-info">
            Editing your message
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        )}
        <div className="input-wrapper">
          <input
            type="text"
            value={messageText}
            onChange={handleInputChange}
            placeholder={adminMode ? 'Reply to this conversation' : 'Type a message'}
            className="chat-input"
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!messageText.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
