import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

export const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  participantId: { type: DataTypes.UUID, allowNull: false },
  adminId: { type: DataTypes.UUID, allowNull: false },
  subject: { type: DataTypes.STRING(255), defaultValue: 'Admin Support' },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'pending'),
    defaultValue: 'active',
  },
  lastMessage: { type: DataTypes.TEXT, allowNull: true },
  lastMessageTime: { type: DataTypes.DATE, allowNull: true },
  participantUnread: { type: DataTypes.INTEGER, defaultValue: 0 },
  adminUnread: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'conversations',
  indexes: [
    { fields: ['participantId'] },
    { fields: ['isActive'] },
    { fields: ['lastMessageTime'] },
  ],
});

export default Conversation;
