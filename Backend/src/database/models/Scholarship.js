import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

export const Scholarship = sequelize.define('Scholarship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  country: { type: DataTypes.STRING(100), allowNull: false },
  deadline: { type: DataTypes.DATE, allowNull: false },
  fundingType: { type: DataTypes.STRING(100), allowNull: true },
  link: { type: DataTypes.TEXT, allowNull: false },
  duration: { type: DataTypes.STRING(100), allowNull: false },
  fieldOfStudy: { type: DataTypes.STRING(255), allowNull: true },
  location: { type: DataTypes.STRING(255), allowNull: true },
  university: { type: DataTypes.STRING(255), allowNull: true },
  tuitionFees: { type: DataTypes.STRING(255), allowNull: true },
  format: { type: DataTypes.STRING(100), allowNull: true },
  attendance: { type: DataTypes.STRING(100), allowNull: true },
  degreeType: { type: DataTypes.STRING(100), allowNull: true },
  specialProgramme: { type: DataTypes.STRING(255), allowNull: true },
  imageUrl: { type: DataTypes.TEXT, allowNull: true },
  imagePublicId: { type: DataTypes.STRING(255), allowNull: true },
  createdById: { type: DataTypes.UUID, allowNull: false },
}, {
  tableName: 'scholarships',
  indexes: [
    { fields: ['country'] },
    { fields: ['fundingType'] },
    { fields: ['deadline'] },
    { fields: ['createdAt'] },
    { fields: ['country', 'fundingType'] },
  ],
});

export default Scholarship;
