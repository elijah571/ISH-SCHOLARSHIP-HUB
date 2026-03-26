import mongoose from 'mongoose';

// Chat Conversation Model
const conversationSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: String,
      default: 'Admin Support',
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'archived'],
      default: 'active',
    },
    lastMessage: {
      type: String,
      default: null,
    },
    lastMessageTime: {
      type: Date,
      default: null,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    participantUnread: {
      type: Number,
      default: 0,
    },
    adminUnread: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Chat Message Model
const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [
      {
        url: String,
        type: String,
        size: Number,
        name: String,
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
conversationSchema.index({ participant: 1, admin: 1 });
conversationSchema.index({ createdAt: -1 });
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);
export const Message = mongoose.model('Message', messageSchema);
