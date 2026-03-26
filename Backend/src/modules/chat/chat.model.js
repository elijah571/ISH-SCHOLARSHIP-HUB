import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    lastMessage: String,
    lastMessageAt: Date,
    unreadCounts: {
      user: { type: Number, default: 0 },
      admin: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Indexes for fast lookups
chatSchema.index({ user: 1 });
chatSchema.index({ admin: 1 });
chatSchema.index({ status: 1 });
chatSchema.index({ updatedAt: -1 });

export const Chat = mongoose.model('Chat', chatSchema);
