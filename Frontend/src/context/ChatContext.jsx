// src/context/ChatContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const socketURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('auth_success', () => {
      console.log('Socket authenticated');
    });

    newSocket.on('auth_error', (data) => {
      console.error('Socket auth error:', data);
      setError(data.message);
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setError(data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [socketURL]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('message_edited', (data) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === data.messageId ? { ...msg, message: data.newMessage } : msg))
      );
    });

    socket.on('message_deleted', (data) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
    });

    socket.on('user_typing', (data) => {
      setTypingUsers((prev) => {
        if (!prev.find((u) => u.userId === data.userId)) {
          return [...prev, data];
        }
        return prev;
      });
    });

    socket.on('stop_typing', (data) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    socket.on('messages_marked_read', (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId === data.conversationId ? { ...msg, isRead: true } : msg
        )
      );
    });

    socket.on('online_users', (data) => {
      setOnlineUsers(data);
    });

    socket.on('user_joined', (data) => {
      setOnlineUsers((prev) => {
        if (!prev.find((u) => u.userId === data.userId)) {
          return [...prev, { userId: data.userId, userName: data.userName, isOnline: true }];
        }
        return prev;
      });
    });

    socket.on('user_left', (data) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    socket.on('new_message_notification', (data) => {
      // Handle notification (can trigger browser notification)
      console.log('New message:', data);
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_edited');
      socket.off('message_deleted');
      socket.off('user_typing');
      socket.off('stop_typing');
      socket.off('messages_marked_read');
      socket.off('online_users');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('new_message_notification');
    };
  }, [socket]);

  const authenticateSocket = (token) => {
    if (socket) {
      socket.emit('authenticate', token);
    }
  };

  const joinConversation = (conversationId) => {
    if (socket) {
      socket.emit('join_conversation', conversationId);
      setCurrentConversation(conversationId);
    }
  };

  const sendMessage = (conversationId, message, attachments = []) => {
    if (socket) {
      socket.emit('send_message', { conversationId, message, attachments });
    }
  };

  const editMessage = (messageId, newMessage) => {
    if (socket) {
      socket.emit('edit_message', { messageId, newMessage });
    }
  };

  const deleteMessage = (messageId, conversationId) => {
    if (socket) {
      socket.emit('delete_message', { messageId, conversationId });
    }
  };

  const markAsRead = (conversationId) => {
    if (socket) {
      socket.emit('mark_read', { conversationId });
    }
  };

  const notifyTyping = (conversationId) => {
    if (socket) {
      socket.emit('user_typing', { conversationId });
    }
  };

  const notifyStopTyping = (conversationId) => {
    if (socket) {
      socket.emit('stop_typing', { conversationId });
    }
  };

  const getOnlineUsers = (conversationId) => {
    if (socket) {
      socket.emit('get_online_users', conversationId);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        isConnected,
        conversations,
        setConversations,
        currentConversation,
        setCurrentConversation,
        messages,
        setMessages,
        onlineUsers,
        typingUsers,
        loading,
        setLoading,
        error,
        setError,
        authenticateSocket,
        joinConversation,
        sendMessage,
        editMessage,
        deleteMessage,
        markAsRead,
        notifyTyping,
        notifyStopTyping,
        getOnlineUsers,
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
