import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

export const UserSavedScholarship = sequelize.define('UserSavedScholarship', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  scholarshipId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  savedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_saved_scholarships',
  timestamps: false,
});

export default UserSavedScholarship;
