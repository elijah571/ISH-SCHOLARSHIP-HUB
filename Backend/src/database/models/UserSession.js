import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

export const UserSession = sequelize.define('UserSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING(512),
    allowNull: false,
    unique: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
}, {
  tableName: 'user_sessions',
  indexes: [{ fields: ['userId'] }, { fields: ['refreshToken'] }],
});

export default UserSession;
