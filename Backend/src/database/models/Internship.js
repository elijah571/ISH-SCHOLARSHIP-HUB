import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

export const Internship = sequelize.define('Internship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING(255), allowNull: false },
  institution: { type: DataTypes.STRING(255), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: false },
  country: { type: DataTypes.STRING(100), allowNull: false },
  deadline: { type: DataTypes.DATE, allowNull: true },
  type: { type: DataTypes.STRING(100), allowNull: true },
  link: { type: DataTypes.TEXT, allowNull: true },
  startDate: { type: DataTypes.DATE, allowNull: true },
  endDate: { type: DataTypes.DATE, allowNull: true },
  imageUrl: { type: DataTypes.TEXT, allowNull: true },
  imagePublicId: { type: DataTypes.STRING(255), allowNull: true },
  createdById: { type: DataTypes.UUID, allowNull: false },
}, {
  tableName: 'internships',
  indexes: [{ fields: ['country'] }, { fields: ['createdAt'] }],
});

export default Internship;
