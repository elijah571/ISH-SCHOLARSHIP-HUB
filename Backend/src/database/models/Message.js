import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

export const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  conversationId: { type: DataTypes.UUID, allowNull: false },
  senderId: { type: DataTypes.UUID, allowNull: false },
  senderRole: { type: DataTypes.ENUM('user', 'admin'), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  attachments: { type: DataTypes.JSONB, defaultValue: [] },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt: { type: DataTypes.DATE, allowNull: true },
  editedAt: { type: DataTypes.DATE, allowNull: true },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'messages',
  indexes: [
    { fields: ['conversationId'] },
    { fields: ['isDeleted'] },
    { fields: ['createdAt'] },
  ],
});

export default Message;
