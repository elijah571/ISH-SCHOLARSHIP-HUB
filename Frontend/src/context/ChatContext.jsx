/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getAccessToken } from '../services/api';

const ChatContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [error, setError] = useState(null);
  const [latestConversationActivity, setLatestConversationActivity] = useState(null);

  const socketRef = useRef(null);
  const isAuthenticatedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (socketRef.current) return;

    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      const token = getAccessToken();
      if (token && !isAuthenticatedRef.current) {
        newSocket.emit('authenticate', token);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('auth_success', () => {
      isAuthenticatedRef.current = true;
    });

    newSocket.on('auth_error', (data) => {
      isAuthenticatedRef.current = false;
      setError(data.message);
    });

    newSocket.on('error', (data) => {
      setError(data.message);
    });

    newSocket.on('receive_message', (data) => {
      setLatestConversationActivity({
        conversationId: data.conversationId,
        sender: data.sender?.fullName || data.sender?.email || 'Unknown',
        message: data.message,
        timestamp: Date.now(),
        type: 'message',
      });
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });
    });

    newSocket.on('message_edited', (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, message: data.newMessage, editedAt: data.editedAt } : msg
        )
      );
    });

    newSocket.on('message_deleted', (data) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
    });

    newSocket.on('user_typing', (data) => {
      setTypingUsers((prev) => {
        if (!prev.some((u) => u.userId === data.userId)) {
          return [...prev, data];
        }
        return prev;
      });
    });

    newSocket.on('stop_typing', (data) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    newSocket.on('messages_marked_read', (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId === data.conversationId ? { ...msg, isRead: true } : msg
        )
      );
    });

    newSocket.on('conversation_updated', (data) => {
      setLatestConversationActivity({
        conversationId: data.id,
        sender: data.participant?.fullName || data.admin?.fullName || 'Unknown',
        message: data.lastMessage || data.subject || '',
        timestamp: Date.now(),
        type: 'conversation',
      });
    });

    newSocket.on('online_users', (data) => {
      setOnlineUsers(data);
    });

    newSocket.on('user_joined', (data) => {
      setOnlineUsers((prev) => {
        if (!prev.some((u) => u.userId === data.userId)) {
          return [...prev, { userId: data.userId, userName: data.userName, isOnline: true }];
        }
        return prev;
      });
    });

    newSocket.on('user_left', (data) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    newSocket.on('new_message_notification', (data) => {
      setLatestConversationActivity({
        ...data,
        timestamp: Date.now(),
        type: 'notification',
      });
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      isAuthenticatedRef.current = false;
    };
  }, [user]);

  useEffect(() => {
    const token = getAccessToken();
    if (user && token && socketRef.current && !isAuthenticatedRef.current) {
      socketRef.current.emit('authenticate', token);
    }

    if (!user) {
      isAuthenticatedRef.current = false;
    }
  }, [isConnected, user]);

  const authenticateSocket = useCallback((token) => {
    if (socketRef.current && token) {
      socketRef.current.emit('authenticate', token);
    }
  }, []);

  const joinConversation = useCallback((conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('join_conversation', conversationId);
    }
  }, []);

  const leaveConversation = useCallback((conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('leave_conversation', conversationId);
    }
  }, []);

  const sendMessage = useCallback((conversationId, message, attachments = []) => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', { conversationId, message, attachments });
    }
  }, []);

  const editMessage = useCallback((messageId, newMessage) => {
    if (socketRef.current) {
      socketRef.current.emit('edit_message', { messageId, newMessage });
    }
  }, []);

  const deleteMessage = useCallback((messageId, conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('delete_message', { messageId, conversationId });
    }
  }, []);

  const markAsRead = useCallback((conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('mark_read', { conversationId });
    }
  }, []);

  const notifyTyping = useCallback((conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('user_typing', { conversationId });
    }
  }, []);

  const notifyStopTyping = useCallback((conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('stop_typing', { conversationId });
    }
  }, []);

  const getOnlineUsers = useCallback((conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('get_online_users', conversationId);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isConnected,
        messages,
        setMessages,
        onlineUsers,
        typingUsers,
        error,
        setError,
        latestConversationActivity,
        authenticateSocket,
        joinConversation,
        leaveConversation,
        sendMessage,
        editMessage,
        deleteMessage,
        markAsRead,
        notifyTyping,
        notifyStopTyping,
        getOnlineUsers,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
