# Chat System - Usage Examples & Code Snippets

## Frontend Usage Examples

### 1. Using Chat Context

```javascript
import { useChat } from '../context/ChatContext';

function MyComponent() {
  const { messages, conversations, isConnected, sendMessage, joinConversation, markAsRead } =
    useChat();

  const handleSendMessage = (text) => {
    sendMessage(conversationId, text);
  };

  return (
    <div>
      <p>Connected: {isConnected ? '✓' : '✗'}</p>
      <p>Messages: {messages.length}</p>
      <button onClick={() => handleSendMessage('Hi!')}>Send</button>
    </div>
  );
}
```

### 2. Using Chat Service (API)

```javascript
import chatService from '../services/chatService';

// Get all conversations (admin)
async function getAdminConversations() {
  try {
    const response = await chatService.getAdminConversations(1, 20);
    console.log(response.data.data); // conversations array
    console.log(response.data.pagination); // pagination info
  } catch (error) {
    console.error('Error:', error);
  }
}

// Send message via REST API
async function sendMessageViaAPI(conversationId, text) {
  try {
    const response = await chatService.sendMessage(conversationId, text);
    console.log('Message sent:', response.data.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Create/get conversation with admin
async function startConversation(adminId) {
  try {
    const response = await chatService.createOrGetConversation(
      adminId,
      'Question about scholarship'
    );
    console.log('Conversation:', response.data.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get admin statistics
async function getStats() {
  try {
    const response = await chatService.getAdminStats();
    console.log('Stats:', response.data.data);
    // {
    //   activeConversations: 5,
    //   totalMessages: 250,
    //   unreadMessages: 2,
    //   closedConversations: 10
    // }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Search conversations
async function searchConvs(query) {
  try {
    const response = await chatService.searchConversations(query);
    console.log('Search results:', response.data.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 3. Socket.io Real-time Communication

```javascript
import { useChat } from '../context/ChatContext';

function ChatComponent() {
  const {
    socket,
    isConnected,
    messages,
    onlineUsers,
    typingUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    notifyTyping,
    notifyStopTyping,
  } = useChat();

  // Send message in real-time
  const handleSendMessage = (text) => {
    sendMessage(conversationId, text); // Emits via socket.io
  };

  // Edit message in real-time
  const handleEditMessage = (messageId, newText) => {
    editMessage(messageId, newText); // Emits via socket.io
  };

  // Delete message in real-time
  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId, conversationId); // Emits via socket.io
  };

  // Notify typing
  const handleTyping = () => {
    notifyTyping(conversationId); // Emits via socket.io
  };

  // Stop typing notification
  const handleStopTyping = () => {
    notifyStopTyping(conversationId); // Emits via socket.io
  };

  return (
    <div>
      {/* Connection Status */}
      <div className={isConnected ? 'connected' : 'disconnected'}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      {/* Messages */}
      {messages.map((msg) => (
        <div key={msg._id}>
          <strong>{msg.sender.fullName}:</strong> {msg.message}
          {msg.isRead && '✓ Read'}
        </div>
      ))}

      {/* Online Users */}
      <div>Online: {onlineUsers.map((u) => u.userName).join(', ')}</div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div>{typingUsers.map((u) => u.userName).join(', ')} is typing...</div>
      )}

      {/* Input */}
      <input onFocus={handleTyping} onBlur={handleStopTyping} />
    </div>
  );
}
```

### 4. Admin Dashboard Integration

```javascript
import { AdminChatDashboard } from '../components/chat';

function AdminPage() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <AdminChatDashboard />
    </div>
  );
}

// OR use individual components:
import { ChatWindow, ConversationList } from '../components/chat';

function CustomAdminView() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ width: '30%' }}>
        <ConversationList onSelectConversation={setSelectedConversation} adminMode={true} />
      </div>
      <div style={{ width: '70%' }}>
        {selectedConversation && (
          <ChatWindow conversationId={selectedConversation} adminMode={true} />
        )}
      </div>
    </div>
  );
}
```

## Backend Usage Examples

### 1. Using Chat Service

```javascript
import {
  createOrGetConversation,
  getAdminConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  closeConversation,
  getAdminChatStats,
} from './modules/chat/chat.service.js';

// Create/get conversation
const conv = await createOrGetConversation(userId, adminId, 'Help with scholarship');

// Get all conversations for admin
const { conversations, pagination } = await getAdminConversations(adminId, 1, 20);

// Get messages in conversation
const { messages, pagination } = await getMessages(conversationId, 1, 50);

// Send message
const message = await sendMessage(conversationId, userId, 'user', 'Hello, I need help!', []);

// Mark messages as read
await markMessagesAsRead(conversationId, userId);

// Close conversation
const closedConv = await closeConversation(conversationId, adminId);

// Get admin stats
const stats = await getAdminChatStats(adminId);
```

### 2. Using Chat Routes Directly

```javascript
// All routes are protected with VerifyUser middleware
// Make sure to include Authorization header with JWT token

// GET /api/chat/conversations/admin
// Returns: { success, data, pagination }

// GET /api/chat/conversations/:conversationId
// Returns: { success, data }

// POST /api/chat/messages
// Body: { conversationId, message, attachments }
// Returns: { success, data }

// PATCH /api/chat/messages/:messageId
// Body: { message }
// Returns: { success, data }

// DELETE /api/chat/messages/:messageId
// Returns: { success, message }

// GET /api/chat/stats
// Returns: { success, data }
```

### 3. Socket.io Event Handling

```javascript
import { initializeChatSocket } from './services/chat.socket.js';

// Initialize (already done in server.js)
initializeChatSocket(io);

// Listen to client events (happens automatically):

// Client sends message
socket.on('send_message', async (data) => {
  // data = { conversationId, message, attachments }
  // Backend saves to DB
  // Broadcasts to conversation room
});

// Client edits message
socket.on('edit_message', async (data) => {
  // data = { messageId, newMessage }
  // Backend updates DB
  // Broadcasts to conversation room
});

// Client deletes message
socket.on('delete_message', async (data) => {
  // data = { messageId, conversationId }
  // Backend marks as deleted
  // Broadcasts to conversation room
});

// Client joins conversation
socket.on('join_conversation', async (conversationId) => {
  // Backend adds socket to conversation room
  // Broadcasts user_joined event
});

// Client marks as read
socket.on('mark_read', async (data) => {
  // data = { conversationId }
  // Backend updates message read status
  // Broadcasts messages_marked_read event
});
```

## Complete Example: Building a Chat Modal

```jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import chatService from '../services/chatService';

export function ChatModal({ adminId, onClose }) {
  const { user } = useAuth();
  const { messages, setMessages, sendMessage, joinConversation } = useChat();
  const [conversation, setConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize conversation
  useEffect(() => {
    const initChat = async () => {
      try {
        // Create or get conversation with admin
        const response = await chatService.createOrGetConversation(adminId, 'User Support');

        const conv = response.data.data;
        setConversation(conv);

        // Join the conversation room via socket
        joinConversation(conv._id);

        // Load messages
        const msgResponse = await chatService.getMessages(conv._id);
        setMessages(msgResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setLoading(false);
      }
    };

    initChat();
  }, [adminId, joinConversation, setMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim() || !conversation) return;

    // Send via socket (real-time)
    sendMessage(conversation._id, messageText);
    setMessageText('');
  };

  if (loading) {
    return <div>Loading chat...</div>;
  }

  return (
    <div className="chat-modal">
      <div className="chat-modal-header">
        <h3>Chat with Admin</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="chat-modal-messages">
        {messages.map((msg) => (
          <div key={msg._id} className={`msg msg-${msg.senderRole}`}>
            <p className="msg-sender">{msg.sender.fullName}</p>
            <p className="msg-text">{msg.message}</p>
            <p className="msg-time">{new Date(msg.createdAt).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="chat-modal-input">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="msg-input"
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  );
}

// Usage:
function Page() {
  const [showChat, setShowChat] = useState(false);
  const adminId = '...admin_user_id...';

  return (
    <div>
      <button onClick={() => setShowChat(true)}>Open Chat</button>
      {showChat && <ChatModal adminId={adminId} onClose={() => setShowChat(false)} />}
    </div>
  );
}
```

## Complete Example: Admin Dashboard Customization

```jsx
import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import chatService from '../services/chatService';

export function CustomAdminDashboard() {
  const { messages, joinConversation, sendMessage } = useChat();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    loadConversations();
    loadStats();
  }, [filter]);

  const loadConversations = async () => {
    try {
      const response = await chatService.getAdminConversations(1, 50);
      const filtered = response.data.data.filter((conv) => conv.status === filter);
      setConversations(filtered);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await chatService.getAdminStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSelectConversation = (convId) => {
    setSelectedConv(convId);
    joinConversation(convId);
  };

  const handleSendMessage = (text) => {
    if (selectedConv) {
      sendMessage(selectedConv, text);
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConv) return;

    try {
      await chatService.closeConversation(selectedConv);
      loadConversations();
      setSelectedConv(null);
    } catch (error) {
      console.error('Error closing conversation:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Chat Dashboard</h2>

      {/* Stats */}
      {stats && (
        <div className="stats-container">
          <div className="stat">
            <span>Active</span>
            <h3>{stats.activeConversations}</h3>
          </div>
          <div className="stat">
            <span>Unread</span>
            <h3>{stats.unreadMessages}</h3>
          </div>
          <div className="stat">
            <span>Total Messages</span>
            <h3>{stats.totalMessages}</h3>
          </div>
        </div>
      )}

      <div className="admin-content">
        {/* Conversation List */}
        <div className="conv-list">
          <div className="filter-buttons">
            {['active', 'closed', 'archived'].map((status) => (
              <button
                key={status}
                className={filter === status ? 'active' : ''}
                onClick={() => setFilter(status)}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>

          {conversations.map((conv) => (
            <div
              key={conv._id}
              className={`conv-item ${selectedConv === conv._id ? 'selected' : ''}`}
              onClick={() => handleSelectConversation(conv._id)}
            >
              <h4>{conv.participant.fullName}</h4>
              <p>{conv.lastMessage}</p>
              {conv.adminUnread > 0 && <span className="badge">{conv.adminUnread}</span>}
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="chat-area">
          {selectedConv ? (
            <>
              <div className="messages">
                {messages.map((msg) => (
                  <div key={msg._id} className={`message message-${msg.senderRole}`}>
                    <strong>{msg.sender.fullName}:</strong> {msg.message}
                  </div>
                ))}
              </div>

              <div className="input-area">
                <input
                  type="text"
                  placeholder="Type your response..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button onClick={handleCloseConversation}>Close Conversation</button>
              </div>
            </>
          ) : (
            <p>Select a conversation to chat</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

## Testing Checklist

```javascript
// Test 1: Create Conversation
✓ POST /api/chat/conversations
✓ Response includes conversation ID
✓ Conversation is in database

// Test 2: Send Message
✓ POST /api/chat/messages
✓ Message appears in database
✓ Socket.io broadcasts to room
✓ Message appears in real-time for recipient

// Test 3: Edit Message
✓ PATCH /api/chat/messages/:id
✓ Message updated in database
✓ Socket.io broadcasts edit event
✓ Edit shows in UI for all users

// Test 4: Delete Message
✓ DELETE /api/chat/messages/:id
✓ Message soft-deleted in database
✓ Socket.io broadcasts delete event
✓ Message disappears from UI

// Test 5: Mark Read
✓ PATCH /api/chat/conversations/:id/read
✓ Messages marked as read in database
✓ Socket.io broadcasts read event
✓ Read indicator shows in UI

// Test 6: Typing Indicator
✓ emit 'user_typing'
✓ Other users see "User is typing..."
✓ Auto stop typing after 3 seconds
✓ Typing indicator disappears

// Test 7: Online Status
✓ emit 'get_online_users'
✓ List of online users received
✓ Online users shown in UI
✓ User leaves → removed from online list

// Test 8: Admin Features
✓ Only admins see /conversations/admin
✓ Admin can close conversation
✓ Admin can see statistics
✓ Admin can search conversations
```

These examples provide practical starting points for integrating and using the chat system!
