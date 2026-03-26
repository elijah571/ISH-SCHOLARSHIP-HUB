# Chat System Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         WEB BROWSER                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               React Frontend (Vite)                       │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  ChatPage                                            │ │  │
│  │  │  ├─ AdminChatDashboard (for admins)                │ │  │
│  │  │  │  ├─ Statistics Cards                             │ │  │
│  │  │  │  ├─ ConversationList                             │ │  │
│  │  │  │  └─ ChatWindow                                   │ │  │
│  │  │  └─ User Chat (for regular users)                  │ │  │
│  │  │     ├─ ConversationList                             │ │  │
│  │  │     └─ ChatWindow                                   │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  ChatContext (Global State)                         │  │  │
│  │  │  - messages                                          │  │  │
│  │  │  - conversations                                    │  │  │
│  │  │  - socket connection                               │  │  │
│  │  │  - online users                                    │  │  │
│  │  │  - typing users                                    │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
              │                                  │
              │ HTTP REST API                   │ WebSocket (Socket.io)
              │                                  │
              ↓                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                       NODE.js Backend (Express)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Chat Module                             │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Routes (chat.routes.js)                            │  │  │
│  │  │ - POST /conversations                             │  │  │
│  │  │ - GET /conversations/admin                        │  │  │
│  │  │ - GET /conversations/user                         │  │  │
│  │  │ - POST /messages                                  │  │  │
│  │  │ - PATCH /messages/:id                             │  │  │
│  │  │ - DELETE /messages/:id                            │  │  │
│  │  │ - GET /stats                                      │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                           ↓                                │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Controllers (chat.controller.js)                  │  │  │
│  │  │ - createOrGetConversationCtrl()                  │  │  │
│  │  │ - getAdminConversationsCtrl()                    │  │  │
│  │  │ - sendMessageCtrl()                              │  │  │
│  │  │ - editMessageCtrl()                              │  │  │
│  │  │ - deleteMessageCtrl()                            │  │  │
│  │  │ - getAdminChatStatsCtrl()                        │  │  │
│  │  │ - searchConversationsCtrl()                      │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                           ↓                                │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Service Layer (chat.service.js)                   │  │  │
│  │  │ - createOrGetConversation()                       │  │  │
│  │  │ - sendMessage()                                   │  │  │
│  │  │ - getMessages()                                   │  │  │
│  │  │ - editMessage()                                   │  │  │
│  │  │ - deleteMessage()                                 │  │  │
│  │  │ - markMessagesAsRead()                            │  │  │
│  │  │ - closeConversation()                             │  │  │
│  │  │ - searchConversations()                           │  │  │
│  │  │ - getAdminChatStats()                             │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               Socket.io Handler (chat.socket.js)          │  │
│  │  - authenticate(token)                                    │  │
│  │  - join_conversation(convId)                             │  │
│  │  - send_message(data)                                    │  │
│  │  - edit_message(data)                                    │  │
│  │  - delete_message(data)                                  │  │
│  │  - mark_read(data)                                       │  │
│  │  - user_typing(data)                                     │  │
│  │  - stop_typing(data)                                     │  │
│  │  - disconnect()                                           │  │
│  │                                                             │  │
│  │  Broadcasting to Conversation Rooms                       │  │
│  │  (conversation_<convId>)                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │             MongoDB Database                               │  │
│  │  - Conversation Collection                                │  │
│  │  - Message Collection                                     │  │
│  │  - User Collection (existing)                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Message Flow Diagram

### 1. User Sends Message

```
User Types Message in ChatWindow
           │
           ↓
User Clicks Send Button
           │
           ↓
sendMessage() called in ChatContext
           │
           ↓
Socket.io emits 'send_message' event
{conversationId, message, attachments}
           │
           ↓ (WebSocket)
Backend receives 'send_message'
           │
           ↓
Validate message content
           │
           ↓
Create Message document in DB
{conversation, sender, message, timestamp}
           │
           ↓
Update Conversation lastMessage
Update unread counts
           │
           ↓
Broadcast 'receive_message' to all users
in conversation_<convId> room
           │
           ↓ (All users in conversation receive)
ChatWindow receives 'receive_message'
           │
           ↓
Update messages state
           │
           ↓
Message appears for all users instantly ✓
```

### 2. Admin Views Conversation

```
Admin clicks conversation in ConversationList
           │
           ↓
Selected conversation ID passed to ChatWindow
           │
           ↓
loadMessages() called
           │
           ↓
GET /api/chat/conversations/:id/messages
           │
           ↓ (HTTP)
Backend fetches messages from DB
(sorted by createdAt, with pagination)
           │
           ↓
Returns array of messages
           │
           ↓
Frontend displays messages
           │
           ↓
Socket.io 'join_conversation' emitted
           │
           ↓
Backend adds admin to conversation_<convId> room
           │
           ↓
markAsRead() called
           │
           ↓
PATCH /api/chat/conversations/:id/read
           │
           ↓
Backend marks all messages as read for admin
Updates adminUnread to 0
           │
           ↓
Socket broadcasts 'messages_marked_read'
```

### 3. Real-time Typing Indicator

```
User starts typing
           │
           ↓
Input onChange fires
           │
           ↓
notifyTyping() called
           │
           ↓
Socket.io emits 'user_typing'
{conversationId}
           │
           ↓ (WebSocket)
Backend receives 'user_typing'
           │
           ↓
Broadcasts to conversation_<convId> room
           │
           ↓ (All users in conversation receive)
Frontend receives 'user_typing'
           │
           ↓
Add user to typingUsers state
           │
           ↓
Display "User is typing..." indicator ✓
           │
           ↓ (After 3 seconds of inactivity)
notifyStopTyping() called
           │
           ↓
Removes user from typingUsers
           │
           ↓
Typing indicator disappears ✓
```

## Database Schema Relationship

```
┌─────────────────────────────────────────────────────────────┐
│ User Collection                                               │
│ {_id, fullName, email, role, ...existing fields}             │
│                                                               │
│ Used as:                                                      │
│ - admin (in Conversation)                                    │
│ - participant (in Conversation)                              │
│ - sender (in Message)                                        │
└─────────────────────────────────────────────────────────────┘
         ▲                               ▲
         │ ref                           │ ref
         │                               │
         │                               │
┌────────┴───────────────────────────────┴──────────────────┐
│ Conversation Collection                                    │
│ {                                                          │
│   _id: ObjectId,                                           │
│   participant: User._id,  ◄──── One user (participant)    │
│   admin: User._id,        ◄──── One admin                  │
│   subject: String,                                         │
│   status: String,                                          │
│   lastMessage: String,                                     │
│   lastMessageTime: Date,                                   │
│   adminUnread: Number,                                     │
│   participantUnread: Number,                               │
│   createdAt: Date,                                         │
│   updatedAt: Date                                          │
│ }                                                          │
│                                                            │
│ One-to-Many:                                               │
│ One Conversation has Many Messages                         │
└────────┬────────────────────────────────────────────────┘
         │ ref (conversation)
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Message Collection                                            │
│ {                                                             │
│   _id: ObjectId,                                             │
│   conversation: Conversation._id,  ◄──── Links to conv     │
│   sender: User._id,                ◄──── Who sent it       │
│   senderRole: String,                                       │
│   message: String,                                          │
│   attachments: Array,                                       │
│   isRead: Boolean,                                          │
│   readAt: Date,                                             │
│   editedAt: Date,                                           │
│   isDeleted: Boolean,                                       │
│   createdAt: Date,                                          │
│   updatedAt: Date                                           │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘

Indexes created:
- Conversation: (participant, admin), (createdAt)
- Message: (conversation, createdAt), (sender, createdAt)
```

## Authentication & Authorization Flow

```
User Logs In
     │
     ├─ Backend generates JWT token
     │  (includes userId, role)
     │
     └─ Token stored in localStorage (frontend)
              │
              ↓
User navigates to /chat
     │
     ├─ ChatProvider wraps app
     │
     ├─ ChatContext reads token from localStorage
     │
     ├─ Socket.io emits 'authenticate' event
     │  with token
     │
     ├─ Backend verifies JWT token
     │
     ├─ If valid:
     │  └─ Mark socket as authenticated
     │     Store userId, role, socket.id
     │     Emit 'auth_success'
     │
     └─ If invalid:
        └─ Emit 'auth_error'
           Disconnect socket
     │
     ↓
API Requests
     │
     ├─ Include token in Authorization header
     │  "Authorization: Bearer <token>"
     │
     ├─ Backend middleware (VerifyUser)
     │
     ├─ If valid:
     │  └─ Attach user to req.user
     │     Execute route handler
     │     Apply authorization checks
     │
     └─ If invalid:
        └─ Return 401 Unauthorized
     │
     ↓
Authorization Checks
     │
     ├─ User can only access own conversations
     │  (checks: participant == req.user._id)
     │
     ├─ Admin can only access admin conversations
     │  (checks: req.user.role == 'admin')
     │
     ├─ Admin can only close conversations
     │  (checks: admin == req.user._id)
     │
     └─ Users can only edit/delete own messages
        (checks: sender == req.user._id)
```

## Real-time Features

```
┌─────────────────────────────────────────────────────────────┐
│                 Socket.io Rooms                               │
│                                                               │
│  For each conversation, a room is created:                   │
│  "conversation_<conversationId>"                             │
│                                                               │
│  When user joins conversation:                               │
│  socket.join("conversation_<convId>")                        │
│                                                               │
│  Broadcasting to room:                                       │
│  io.to("conversation_<convId>").emit('event', data)          │
│                                                               │
│  Broadcast to all EXCEPT sender:                             │
│  socket.to("conversation_<convId>").emit('event', data)      │
└─────────────────────────────────────────────────────────────┘

Active Users Tracking:
┌──────────────────────────────────────┐
│ activeUsers Map                      │
│ {                                    │
│   userId: {                          │
│     socketId: 'socket_id',          │
│     role: 'admin' | 'user',         │
│     name: 'Full Name',              │
│     email: 'user@example.com'       │
│   }                                  │
│ }                                    │
└──────────────────────────────────────┘

When message sent:
┌────────────────────────────────────────┐
│ Check if recipient is online:          │
│ let recipient = activeUsers.get(id);   │
│                                        │
│ If online:                             │
│ Send notification to recipient's      │
│ socket: "new_message_notification"    │
└────────────────────────────────────────┘
```

## State Management in ChatContext

```
┌────────────────────────────────────────────────────────────┐
│ ChatContext State Variables                                 │
├────────────────────────────────────────────────────────────┤
│                                                              │
│ socket                                                       │
│ └─ WebSocket instance                                       │
│    (manages connection, events, room management)            │
│                                                              │
│ isConnected (boolean)                                        │
│ └─ Socket connection status                                 │
│                                                              │
│ conversations (Array)                                        │
│ └─ List of user's or admin's conversations                 │
│    [{_id, participant, admin, lastMessage, ...}]           │
│                                                              │
│ currentConversation (string)                                 │
│ └─ Currently selected conversation ID                       │
│                                                              │
│ messages (Array)                                             │
│ └─ Messages in current conversation                         │
│    [{_id, sender, message, createdAt, isRead, ...}]        │
│                                                              │
│ onlineUsers (Array)                                          │
│ └─ Users currently online in conversation                   │
│    [{userId, userName, isOnline}]                           │
│                                                              │
│ typingUsers (Array)                                          │
│ └─ Users currently typing                                   │
│    [{userId, userName}]                                     │
│                                                              │
│ loading (boolean)                                            │
│ └─ Loading state for async operations                       │
│                                                              │
│ error (string)                                               │
│ └─ Error messages                                            │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
ChatProvider (Context)
│
└─ ChatPage
   │
   ├─ (Admin Users) AdminChatDashboard
   │  │
   │  ├─ Dashboard Header
   │  │  ├─ Title
   │  │  └─ Connection Status Indicator
   │  │
   │  ├─ Stats Cards Row
   │  │  ├─ Active Conversations
   │  │  ├─ Unread Messages
   │  │  ├─ Total Messages
   │  │  └─ Closed Conversations
   │  │
   │  └─ Dashboard Content Grid
   │     ├─ ConversationList (left)
   │     │  ├─ Search Bar
   │     │  ├─ Conversation Items
   │     │  │  ├─ Sender Name
   │     │  │  ├─ Last Message Preview
   │     │  │  ├─ Status Badge
   │     │  │  └─ Unread Count Badge
   │     │  └─ Pagination Controls
   │     │
   │     └─ ChatWindow (right)
   │        ├─ Messages Container
   │        │  └─ Message Items
   │        │     ├─ Sender Info
   │        │     ├─ Message Content
   │        │     ├─ Attachments
   │        │     ├─ Edit/Delete Buttons
   │        │     └─ Read Status
   │        │
   │        ├─ Online Users Bar
   │        │  └─ User Status Indicators
   │        │
   │        └─ Message Input Form
   │           ├─ Text Input
   │           └─ Send Button
   │
   └─ (Regular Users) User Chat View
      │
      ├─ ConversationList (left column)
      │  ├─ Conversation Items
      │  └─ Pagination
      │
      └─ ChatWindow (right column)
         ├─ Messages
         ├─ Online Users
         └─ Input Form
```

This architecture ensures:

- ✅ Real-time communication
- ✅ Scalability through room-based broadcasting
- ✅ Security through JWT and authorization checks
- ✅ Performance through proper indexing and pagination
- ✅ User isolation and data privacy
