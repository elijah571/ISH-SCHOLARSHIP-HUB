// src/components/chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import chatService from '../../services/chatService';
import './ChatWindow.css';

export const ChatWindow = ({ conversationId, adminMode = false }) => {
  const {
    messages,
    setMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    notifyTyping,
    notifyStopTyping,
    onlineUsers,
    typingUsers,
  } = useChat();

  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await chatService.getMessages(conversationId);
        setMessages(response.data.data);
        markAsRead(conversationId);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [conversationId, setMessages, markAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    if (editingMessageId) {
      // Edit existing message
      editMessage(editingMessageId, messageText);
      setEditingMessageId(null);
    } else {
      // Send new message
      sendMessage(conversationId, messageText);
    }

    setMessageText('');
    notifyStopTyping(conversationId);
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    // Notify typing
    notifyTyping(conversationId);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to notify stop typing
    typingTimeoutRef.current = setTimeout(() => {
      notifyStopTyping(conversationId);
    }, 3000);
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message._id);
    setEditText(message.message);
    setMessageText(message.message);
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(messageId, conversationId);
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditText('');
    setMessageText('');
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {isLoading ? (
          <div className="loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start a conversation!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`message ${msg.senderRole === 'admin' ? 'admin' : 'user'}`}
            >
              <div className="message-header">
                <span className="sender-name">{msg.sender.fullName}</span>
                <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="message-content">{msg.message}</div>
              {msg.editedAt && <div className="edited-label">(edited)</div>}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="attachments">
                  {msg.attachments.map((att, idx) => (
                    <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer">
                      📎 {att.name}
                    </a>
                  ))}
                </div>
              )}
              {!adminMode && (
                <div className="message-actions">
                  <button onClick={() => handleEditMessage(msg)} title="Edit message">
                    ✏️
                  </button>
                  <button onClick={() => handleDeleteMessage(msg._id)} title="Delete message">
                    🗑️
                  </button>
                </div>
              )}
              {msg.isRead && <div className="read-indicator">✓ Read</div>}
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

      <div className="online-users">
        {onlineUsers.map((user) => (
          <span key={user.userId} className="online-user">
            🟢 {user.userName}
          </span>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        {editingMessageId && (
          <div className="editing-info">
            Editing message -{' '}
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
            placeholder="Type a message..."
            className="chat-input"
          />
          <button type="submit" className="send-btn" disabled={!messageText.trim()}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
