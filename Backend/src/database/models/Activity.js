import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

const ACTIONS = [
  'registered', 'applied', 'saved', 'unsaved',
  'blog_created', 'blog_updated', 'blog_deleted',
  'scholarship_created', 'scholarship_updated', 'scholarship_deleted',
  'internship_created', 'internship_updated', 'internship_deleted',
  'newsletter_subscribed', 'user_created', 'admin_created', 'user_updated', 'user_deleted',
];

const TARGET_TYPES = ['user', 'scholarship', 'internship', 'blog', 'newsletter'];

export const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: { type: DataTypes.UUID, allowNull: false },
  userName: { type: DataTypes.STRING(120), allowNull: false },
  userEmail: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  action: { type: DataTypes.ENUM(...ACTIONS), allowNull: false },
  targetType: { type: DataTypes.ENUM(...TARGET_TYPES), allowNull: false },
  targetId: { type: DataTypes.STRING(255), allowNull: false },
  targetTitle: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, {
  tableName: 'activities',
  indexes: [{ fields: ['createdAt'] }, { fields: ['action'] }, { fields: ['userId'] }],
});

export default Activity;
