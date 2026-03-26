import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderType: { type: String, enum: ['user', 'admin'], required: true },
    message: String,
    read: { type: Boolean, default: false },
    messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    fileUrl: { url: String, publicId: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ read: 1 });

export const Message = mongoose.model('Message', messageSchema);
