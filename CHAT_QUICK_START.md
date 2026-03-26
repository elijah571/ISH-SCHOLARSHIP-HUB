# Chat System Quick Integration Guide

## Quick Start (5 minutes)

### Backend Setup

1. **Chat routes already integrated** in `Backend/src/app.js`:

   ```javascript
   import chatRoutes from './modules/chat/chat.routes.js';
   app.use('/api/chat', chatRoutes);
   ```

2. **Socket.io already initialized** in `Backend/src/server.js`:

   ```javascript
   import { initializeChatSocket } from './services/chat.socket.js';
   initializeChatSocket(io);
   ```

3. **Run your backend** - no additional setup needed:
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

### Frontend Setup

1. **Wrap your app with ChatProvider** in `main.jsx`:

   ```javascript
   import { ChatProvider } from './context/ChatContext';

   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <ChatProvider>
         <App />
       </ChatProvider>
     </ChatProvider>,
     document.getElementById('root')
   );
   ```

2. **Add chat route** in your routing setup:

   ```javascript
   import { ChatPage } from './pages/ChatPage';

   // In your route configuration
   <Route
     path="/chat"
     element={
       <ProtectedRoute>
         <ChatPage />
       </ProtectedRoute>
     }
   />;
   ```

3. **Add navigation link** in your Navbar:

   ```jsx
   <Link to="/chat" className="nav-link">
     💬 Chat
   </Link>
   ```

4. **Check environment variables** in `Frontend/.env`:

   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_SOCKET_URL=http://localhost:3000
   ```

5. **Run frontend** - no additional setup needed:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

### Verify Installation

1. **Backend running**: http://localhost:3000
2. **Frontend running**: http://localhost:5173
3. **Login as user** and go to `/chat`
4. **Login as admin** and go to `/chat` (see admin dashboard)

## File Locations Summary

### Backend Files Created

- `Backend/src/models/chat.model.js` - Database models
- `Backend/src/modules/chat/chat.service.js` - Business logic
- `Backend/src/modules/chat/chat.controller.js` - API endpoints
- `Backend/src/modules/chat/chat.routes.js` - Route definitions
- `Backend/src/services/chat.socket.js` - Real-time socket events

### Backend Files Modified

- `Backend/src/app.js` - Added chat routes import & usage
- `Backend/src/server.js` - Added socket initialization

### Frontend Files Created

- `Frontend/src/context/ChatContext.jsx` - State management
- `Frontend/src/services/chatService.js` - API client
- `Frontend/src/components/chat/ChatWindow.jsx` - Message display
- `Frontend/src/components/chat/ChatWindow.css` - Chat styling
- `Frontend/src/components/chat/ConversationList.jsx` - Conversation list
- `Frontend/src/components/chat/ConversationList.css` - List styling
- `Frontend/src/components/chat/AdminChatDashboard.jsx` - Admin view
- `Frontend/src/components/chat/AdminChatDashboard.css` - Dashboard styling
- `Frontend/src/pages/ChatPage.jsx` - Main chat page

## Testing the Chat System

### Test 1: User to Admin Chat

1. Open 2 browsers (or incognito/normal)
2. Login as different users in each
3. In user browser: Go to `/chat` → Create conversation with admin
4. In admin browser: Go to `/chat` → See conversation in list → Click it
5. Send messages back and forth (real-time!)
6. See typing indicators, read receipts, etc.

### Test 2: Admin Features

1. Login as admin
2. Go to `/chat`
3. See statistics at top (active conversations, unread, etc.)
4. Search conversations using search bar
5. Close a conversation (admin only)

### Test 3: Real-time Features

1. Open chat in 2 browser windows same conversation
2. Type message in one → see in other instantly
3. Edit message → see update instantly
4. Delete message → disappear instantly
5. See "User is typing..." when typing

## Common Issues & Solutions

### Issue: Socket not connecting

**Solution**:

- Check CORS in `server.js`
- Verify `VITE_SOCKET_URL` in frontend .env

### Issue: Messages not appearing

**Solution**:

- Check green dot next to connection status
- Verify socket authenticated successfully
- Check browser DevTools console

### Issue: Can't see admin conversations

**Solution**:

- Only admins see admin conversations
- Verify user has `role: 'admin'` in database
- Verify token includes correct role

### Issue: Conversation not loading

**Solution**:

- Both users must exist in database
- Conversation must exist before messaging
- Check user has access to that conversation

## API Endpoints Quick Reference

### Conversations

- `POST /api/chat/conversations` - Create/get
- `GET /api/chat/conversations/admin` - List (admin)
- `GET /api/chat/conversations/user` - List (user)
- `GET /api/chat/conversations/:id` - Get one
- `PATCH /api/chat/conversations/:id/close` - Close

### Messages

- `POST /api/chat/messages` - Send
- `GET /api/chat/conversations/:id/messages` - List
- `PATCH /api/chat/messages/:id` - Edit
- `DELETE /api/chat/messages/:id` - Delete
- `PATCH /api/chat/conversations/:id/read` - Mark read

### Admin

- `GET /api/chat/stats` - Statistics
- `GET /api/chat/conversations/search?query=...` - Search

## Next Steps

1. ✅ Backend running with chat
2. ✅ Frontend running with chat UI
3. ✅ Chat routes added
4. ✅ Socket.io connected

### Optional Enhancements

1. **Add file uploads**:
   - Use existing Cloudinary integration
   - Pass `attachments` array to `sendMessage`

2. **Add notifications**:
   - Use browser Notification API
   - Listen to `new_message_notification` socket event

3. **Style customization**:
   - Modify CSS files in `Frontend/src/components/chat/`
   - Match your app's design system

4. **Add more features**:
   - User presence indicators
   - Message reactions
   - Conversation categories
   - Auto-responses

## Support Debugging

**Enable detailed logging**:

```javascript
// In ChatContext.jsx, uncomment socket debug logs:
socket.on('*', (event) => {
  console.log('Socket event:', event);
});
```

**Check backend logs**:

```bash
# Terminal where backend is running
# Look for socket connection logs
```

**Check frontend logs**:

```javascript
// Open browser DevTools → Console tab
// Look for socket/fetch errors
```

That's it! Your chat system is ready to use! 🎉
