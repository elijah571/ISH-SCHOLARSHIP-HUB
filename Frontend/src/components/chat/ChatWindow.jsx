import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import chatService from '../../services/chatService';
import './ChatWindow.css';

export const ChatWindow = ({ conversationId, adminMode = false }) => {
  const chat = useChat();
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        chat.clearMessages();
        const response = await chatService.getMessages(conversationId);
        if (!cancelled) {
          chat.setMessages(response.data.data || []);
          chat.joinConversation(conversationId);
          chat.markAsRead(conversationId);
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
        chat.leaveConversation(conversationId);
      }
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    if (editingMessageId) {
      chat.editMessage(editingMessageId, messageText);
      setEditingMessageId(null);
    } else {
      chat.sendMessage(conversationId, messageText);
    }

    setMessageText('');
    chat.notifyStopTyping(conversationId);
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    chat.notifyTyping(conversationId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      chat.notifyStopTyping(conversationId);
    }, 3000);
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message._id);
    setMessageText(message.message);
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      chat.deleteMessage(messageId, conversationId);
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setMessageText('');
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {isLoading ? (
          <div className="loading">Loading messages...</div>
        ) : chat.messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start a conversation!</div>
        ) : (
          chat.messages.map((msg) => (
            <div
              key={msg._id}
              className={`message ${msg.senderRole === 'admin' ? 'admin' : 'user'}`}
            >
              <div className="message-header">
                <span className="sender-name">
                  {msg.sender?.fullName || 'Unknown'}
                </span>
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">
                {msg.isDeleted ? '(Message deleted)' : msg.message}
              </div>
              {msg.editedAt && !msg.isDeleted && (
                <div className="edited-label">(edited)</div>
              )}
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
              {!adminMode && !msg.isDeleted && (
                <div className="message-actions">
                  <button
                    onClick={() => handleEditMessage(msg)}
                    title="Edit message"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    title="Delete message"
                  >
                    Delete
                  </button>
                </div>
              )}
              {msg.isRead && <div className="read-indicator">Read</div>}
            </div>
          ))
        )}

        {chat.typingUsers.length > 0 && (
          <div className="typing-indicator">
            {chat.typingUsers.map((user) => (
              <span key={user.userId}>{user.userName} is typing...</span>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="online-users">
        {chat.onlineUsers.length > 0 && (
          <span className="online-count">
            {chat.onlineUsers.length} online
          </span>
        )}
        {chat.onlineUsers.map((user) => (
          <span key={user.userId} className="online-user">
            {user.userName}
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
