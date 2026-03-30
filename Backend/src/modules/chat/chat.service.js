import { Conversation, Message } from '../../models/chat.model.js';
import { User } from '../../models/user.model.js';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../utils/logger.js';

const populateConversationUsers = (query) =>
  query
    .populate('participant', 'fullName email avatar role')
    .populate('admin', 'fullName email avatar role');

// Create or get conversation between user and admin
export const createOrGetConversation = async (
  participantId,
  adminId,
  subject = 'Admin Support'
) => {
  try {
    let conversation = await populateConversationUsers(
      Conversation.findOne({
        participant: participantId,
        isActive: true,
      })
    );

    if (!conversation) {
      conversation = await Conversation.create({
        participant: participantId,
        admin: adminId,
        subject,
      });
      await conversation.populate('participant admin', 'fullName email avatar role');
    }

    return conversation;
  } catch (error) {
    logger.error('Error in createOrGetConversation:', error);
    throw error;
  }
};

// Get all conversations for an admin
export const getAdminConversations = async (page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;

    const conversations = await populateConversationUsers(
      Conversation.find({ isActive: true })
      .sort({ lastMessageTime: -1 })
      .skip(skip)
      .limit(limit)
    ).lean();

    const total = await Conversation.countDocuments({ isActive: true });

    return {
      conversations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: skip + conversations.length < total,
      },
    };
  } catch (error) {
    logger.error('Error in getAdminConversations:', error);
    throw error;
  }
};

// Get all conversations for a user (participant)
export const getUserConversations = async (userId, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;

    const conversations = await populateConversationUsers(
      Conversation.find({ participant: userId, isActive: true })
      .sort({ lastMessageTime: -1 })
      .skip(skip)
      .limit(limit)
    ).lean();

    const total = await Conversation.countDocuments({ participant: userId, isActive: true });

    return {
      conversations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: skip + conversations.length < total,
      },
    };
  } catch (error) {
    logger.error('Error in getUserConversations:', error);
    throw error;
  }
};

// Get conversation by ID
export const getConversationById = async (conversationId) => {
  try {
    const conversation = await populateConversationUsers(
      Conversation.findById(conversationId)
    ).lean();

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    return conversation;
  } catch (error) {
    logger.error('Error in getConversationById:', error);
    throw error;
  }
};

// Get messages for a conversation
export const getMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate('sender', 'fullName email avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Message.countDocuments({
      conversation: conversationId,
      isDeleted: false,
    });

    return {
      messages: messages.reverse(),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: skip + messages.length < total,
      },
    };
  } catch (error) {
    logger.error('Error in getMessages:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (
  conversationId,
  senderId,
  senderRole,
  message,
  attachments = []
) => {
  try {
    // Verify conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // Create message
    const newMessage = await Message.create({
      conversation: conversationId,
      sender: senderId,
      senderRole,
      message,
      attachments,
    });

    // Update conversation with last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message,
      lastMessageTime: new Date(),
      status: 'active',
      isActive: true,
      // Only increment unread for the recipient
      ...(senderRole === 'user' && { adminUnread: conversation.adminUnread + 1 }),
      ...(senderRole === 'admin' && { participantUnread: conversation.participantUnread + 1 }),
    });

    await newMessage.populate('sender', 'fullName email avatar role');

    return newMessage;
  } catch (error) {
    logger.error('Error in sendMessage:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId, userId) => {
  try {
    const messages = await Message.updateMany(
      {
        conversation: conversationId,
        isRead: false,
        sender: { $ne: userId }, // Don't mark your own messages
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    // Update conversation unread count
    const conversation = await Conversation.findById(conversationId);
    const user = await User.findById(userId);

    if (user.role === 'admin') {
      await Conversation.findByIdAndUpdate(conversationId, { adminUnread: 0 });
    } else {
      await Conversation.findByIdAndUpdate(conversationId, { participantUnread: 0 });
    }

    return messages;
  } catch (error) {
    logger.error('Error in markMessagesAsRead:', error);
    throw error;
  }
};

// Edit message
export const editMessage = async (messageId, newMessage, userId) => {
  try {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    if (message.sender.toString() !== userId) {
      throw new AppError('You can only edit your own messages', 403);
    }

    message.message = newMessage;
    message.editedAt = new Date();

    await message.save();
    await message.populate('sender', 'fullName email avatar role');

    return message;
  } catch (error) {
    logger.error('Error in editMessage:', error);
    throw error;
  }
};

// Delete message (soft delete)
export const deleteMessage = async (messageId, userId) => {
  try {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    if (message.sender.toString() !== userId) {
      throw new AppError('You can only delete your own messages', 403);
    }

    message.isDeleted = true;
    await message.save();

    return message;
  } catch (error) {
    logger.error('Error in deleteMessage:', error);
    throw error;
  }
};

// Close conversation
export const closeConversation = async (conversationId, userId) => {
  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // Only admin can close conversation
    if (conversation.admin.toString() !== userId) {
      throw new AppError('Only admin can close this conversation', 403);
    }

    conversation.status = 'closed';
    conversation.isActive = false;

    await conversation.save();
    await conversation.populate('participant admin', 'fullName email avatar');

    return conversation;
  } catch (error) {
    logger.error('Error in closeConversation:', error);
    throw error;
  }
};

// Get admin statistics
export const getAdminChatStats = async () => {
  try {
    const stats = {
      activeConversations: await Conversation.countDocuments({
        status: 'active',
      }),
      totalMessages: await Message.countDocuments({}),
      unreadMessages: await Conversation.countDocuments({
        adminUnread: { $gt: 0 },
      }),
      closedConversations: await Conversation.countDocuments({
        status: 'closed',
      }),
    };

    return stats;
  } catch (error) {
    logger.error('Error in getAdminChatStats:', error);
    throw error;
  }
};

// Search conversations
export const searchConversations = async (searchQuery) => {
  try {
    const matchedUsers = await User.find({
      $or: [
        { fullName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
      ],
    }).select('_id');

    const conversations = await populateConversationUsers(
      Conversation.find({
      isActive: true,
      $or: [
        { subject: { $regex: searchQuery, $options: 'i' } },
        { lastMessage: { $regex: searchQuery, $options: 'i' } },
        { participant: { $in: matchedUsers.map((user) => user._id) } },
      ],
    })
      .sort({ lastMessageTime: -1 })
      .limit(20)
    ).lean();

    return conversations;
  } catch (error) {
    logger.error('Error in searchConversations:', error);
    throw error;
  }
};
