import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

export const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING(255), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  imageUrl: { type: DataTypes.TEXT, allowNull: true },
  imagePublicId: { type: DataTypes.STRING(255), allowNull: true },
  published: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdById: { type: DataTypes.UUID, allowNull: false },
}, {
  tableName: 'blogs',
  indexes: [{ fields: ['published'] }, { fields: ['createdAt'] }, { unique: true, fields: ['slug'] }],
});

export default Blog;
