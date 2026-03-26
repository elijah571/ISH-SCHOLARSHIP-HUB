# Admin Dashboard Chat System

A complete real-time chat system for multiple users to communicate with a single admin. Built with Node.js/Express backend and React frontend using Socket.io for real-time messaging.

## Features

### Backend Features

- **Real-time Messaging**: Using Socket.io for instant message delivery
- **Conversation Management**: Create, retrieve, close, and archive conversations
- **Message Management**: Send, edit, delete messages with soft delete support
- **Typing Indicators**: See when others are typing
- **Read Receipts**: Track which messages have been read
- **User Presence**: Know who's online in a conversation
- **Admin Statistics**: Dashboard with conversation and message metrics
- **Search & Pagination**: Search conversations and paginate results
- **File Attachments**: Support for file attachments in messages
- **Authentication**: JWT-based auth with role-based access control

### Frontend Features

- **Admin Dashboard**: Complete chat dashboard for admins with statistics
- **Real-time Updates**: Live message delivery via Socket.io
- **Conversation List**: Browse and search all conversations
- **Chat Window**: Send, edit, and delete messages
- **Typing Indicators**: Visual feedback when users are typing
- **Online Status**: See who's currently online
- **Message History**: View full message history with pagination
- **Responsive Design**: Works on desktop and tablets

## Backend Installation

### 1. Create Chat Models

The chat models are already created at:

- `Backend/src/models/chat.model.js`

Exports:

- `Conversation`: Stores conversation metadata
- `Message`: Stores individual messages

### 2. Create Chat Service

Location: `Backend/src/modules/chat/chat.service.js`

Provides functions for:

- Creating/getting conversations
- Fetching conversations (admin/user)
- Managing messages
- Marking messages as read
- Getting admin statistics
- Searching conversations

### 3. Create Chat Controller

Location: `Backend/src/modules/chat/chat.controller.js`

Endpoints:

- Conversation management (CRUD)
- Message operations
- Read receipts
- Admin statistics

### 4. Create Chat Routes

Location: `Backend/src/modules/chat/chat.routes.js`

Base endpoint: `/api/chat`

#### Conversation Endpoints

```
POST   /conversations              - Create/get conversation
GET    /conversations/admin        - Get admin's conversations
GET    /conversations/user         - Get user's conversations
GET    /conversations/:id          - Get specific conversation
GET    /conversations/search       - Search conversations
PATCH  /conversations/:id/close    - Close conversation
```

#### Message Endpoints

```
POST   /messages                        - Send message
GET    /conversations/:id/messages      - Get messages
PATCH  /messages/:id                    - Edit message
DELETE /messages/:id                    - Delete message
PATCH  /conversations/:id/read          - Mark as read
```

#### Admin Endpoints

```
GET    /stats                      - Get admin statistics
```

### 5. Socket.io Integration

Location: `Backend/src/services/chat.socket.js`

#### Socket Events (Server)

Client → Server:

- `authenticate(token)` - Authenticate user
- `join_conversation(conversationId)` - Join a conversation room
- `send_message({conversationId, message, attachments})` - Send message
- `edit_message({messageId, newMessage})` - Edit message
- `delete_message({messageId, conversationId})` - Delete message
- `mark_read({conversationId})` - Mark messages as read
- `user_typing({conversationId})` - Notify typing
- `stop_typing({conversationId})` - Stop typing notification
- `get_online_users(conversationId)` - Get online users

Server → Client:

- `auth_success` - Authentication successful
- `auth_error` - Authentication failed
- `receive_message` - New message received
- `message_edited` - Message was edited
- `message_deleted` - Message was deleted
- `user_typing` - User is typing
- `stop_typing` - User stopped typing
- `messages_marked_read` - Messages marked as read
- `user_joined` - User joined conversation
- `user_left` - User left conversation
- `online_users` - List of online users
- `new_message_notification` - Notification for new message
- `error` - Error message

### 6. Updated Server Configuration

Files modified:

- `Backend/src/server.js` - Added Socket.io initialization
- `Backend/src/app.js` - Added chat routes

## Frontend Installation

### 1. Chat Service

Location: `Frontend/src/services/chatService.js`

API client for all chat endpoints. Import and use:

```javascript
import chatService from './services/chatService';

// Example usage
const response = await chatService.getAdminConversations(page, limit);
```

### 2. Chat Context

Location: `Frontend/src/context/ChatContext.jsx`

Provides:

- Socket.io connection management
- Real-time event handlers
- Chat state management
- Socket event emitters

Usage:

```javascript
import { useChat } from './context/ChatContext';

function MyComponent() {
  const { messages, sendMessage, isConnected } = useChat();
  // ...
}
```

### 3. Chat Components

#### ChatWindow

Location: `Frontend/src/components/chat/ChatWindow.jsx`

Main chat interface component. Props:

- `conversationId` (string) - ID of conversation
- `adminMode` (boolean) - Whether admin view (default: false)

Features:

- Display messages
- Send new messages
- Edit/delete messages
- Typing indicators
- Online users list
- Message read status

#### ConversationList

Location: `Frontend/src/components/chat/ConversationList.jsx`

List of conversations. Props:

- `onSelectConversation` (function) - Callback when conversation selected
- `adminMode` (boolean) - Show admin-specific features

Features:

- List conversations
- Search conversations
- Pagination
- Unread badge
- Status indicator

#### AdminChatDashboard

Location: `Frontend/src/components/chat/AdminChatDashboard.jsx`

Complete admin dashboard. Features:

- Statistics cards (active conversations, unread, total messages, closed)
- Conversation list
- Chat window
- Real-time updates
- Connection status

#### ChatPage

Location: `Frontend/src/pages/ChatPage.jsx`

Main page component that routes to appropriate view based on user role.

### 4. Styling

CSS files created:

- `ChatWindow.css` - Message display and input styling
- `ConversationList.css` - Conversation list styling
- `AdminChatDashboard.css` - Dashboard layout and stats styling

## Usage

### Admin Setup

1. Admin user logs in
2. Navigate to chat page
3. View all conversations in the left panel
4. Click a conversation to open chat
5. Send/receive messages in real-time
6. View statistics at the top
7. Search conversations using search bar
8. Close conversations when resolved

### User Setup

1. User logs in
2. Navigate to chat page
3. View conversations in left panel
4. Can create new conversation by selecting an admin
5. Send messages and communicate with admin
6. See typing indicators and online status

## Integration Steps

### Step 1: Add ChatProvider to App

In your main `App.jsx` or `main.jsx`:

```javascript
import { ChatProvider } from './context/ChatContext';

function App() {
  return <ChatProvider>{/* Your app components */}</ChatProvider>;
}
```

### Step 2: Add Chat Route

In your routing configuration:

```javascript
import { ChatPage } from './pages/ChatPage';

// In your routes
<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  }
/>;
```

### Step 3: Add Navigation Link

Add chat link to navbar or menu:

```jsx
<Link to="/chat">Chat</Link>
```

### Step 4: Environment Variables

Ensure your frontend `.env` has:

```
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

## API Documentation

### Create/Get Conversation

```bash
POST /api/chat/conversations
Content-Type: application/json

{
  "adminId": "admin_user_id",
  "subject": "Help with scholarship"
}
```

### Send Message

```bash
POST /api/chat/messages
Content-Type: application/json

{
  "conversationId": "conv_id",
  "message": "Hello, I need help",
  "attachments": []
}
```

### Get Admin Conversations

```bash
GET /api/chat/conversations/admin?page=1&limit=20
```

### Get Messages

```bash
GET /api/chat/conversations/{conversationId}/messages?page=1&limit=50
```

### Edit Message

```bash
PATCH /api/chat/messages/{messageId}
Content-Type: application/json

{
  "message": "Updated message text"
}
```

### Delete Message

```bash
DELETE /api/chat/messages/{messageId}
```

### Mark as Read

```bash
PATCH /api/chat/conversations/{conversationId}/read
```

### Close Conversation

```bash
PATCH /api/chat/conversations/{conversationId}/close
```

### Get Admin Stats

```bash
GET /api/chat/stats
```

### Search Conversations

```bash
GET /api/chat/conversations/search?query=scholarship
```

## Database Schema

### Conversation

```javascript
{
  participant: ObjectId (User),
  admin: ObjectId (User),
  subject: String,
  status: 'active' | 'closed' | 'archived',
  lastMessage: String,
  lastMessageTime: Date,
  unreadCount: Number,
  participantUnread: Number,
  adminUnread: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Message

```javascript
{
  conversation: ObjectId (Conversation),
  sender: ObjectId (User),
  senderRole: 'user' | 'admin',
  message: String,
  attachments: [{
    url: String,
    type: String,
    size: Number,
    name: String
  }],
  isRead: Boolean,
  readAt: Date,
  editedAt: Date,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All endpoints follow consistent error handling:

```javascript
{
  "success": false,
  "message": "Error description"
}
```

Common errors:

- 400: Bad request (missing/invalid data)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (no access)
- 404: Not found
- 500: Server error

## Real-time Features

### Message Broadcasting

When a message is sent:

1. Saved to database
2. Broadcast to all users in that conversation room
3. Unread count incremented for recipient

### Typing Indicators

User emits `user_typing` event → other users see typing indicator → after 3s of inactivity, auto `stop_typing`

### Read Receipts

Users can mark messages as read → automatically updates in real-time via socket

### Online Presence

Online users are tracked and shared in each conversation room

## Performance Considerations

1. **Pagination**: Messages and conversations are paginated to reduce data transfer
2. **Indexes**: Database indexes on frequently queried fields (conversation, sender, createdAt)
3. **Socket Rooms**: Users are grouped by conversation for efficient broadcasting
4. **Lazy Loading**: Messages load on demand as user scrolls
5. **Soft Deletes**: Messages are soft-deleted to maintain data integrity

## Security

1. **JWT Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only access their own conversations
3. **Role-based Access**: Only admins can access admin statistics
4. **Input Validation**: All inputs validated with Joi
5. **CSRF Protection**: Integrated with existing CSRF protection
6. **Rate Limiting**: Inherited from app-wide rate limiting

## Future Enhancements

1. **File Uploads**: Integrate with Cloudinary for file uploads
2. **Notifications**: Browser push notifications for new messages
3. **User Blocking**: Allow users to block admins
4. **Message Reactions**: Add emoji reactions to messages
5. **Voice/Video Calls**: Integrate for real-time calling
6. **Message Encryption**: End-to-end encryption for messages
7. **Chatbots**: AI-powered quick responses
8. **Auto-responses**: Set away messages and auto-responses
9. **Chat Transcripts**: Export conversation history
10. **Conversation Tags**: Categorize conversations

## Troubleshooting

### Socket Connection Issues

- Check CORS settings in server.js
- Verify Socket.io URL in frontend .env
- Check browser console for connection errors

### Messages Not Sending

- Verify user is authenticated with socket
- Check conversation exists and user has access
- Check network tab for API errors

### Messages Not Appearing

- Verify socket is connected (green dot)
- Check if user is in correct conversation room
- Check browser console for errors

### Authentication Failing

- Ensure token is valid and not expired
- Check token is being sent with socket initialization
- Verify JWT_ACCESS_SECRET in env

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Check server logs for backend errors
4. Verify environment variables are set correctly
