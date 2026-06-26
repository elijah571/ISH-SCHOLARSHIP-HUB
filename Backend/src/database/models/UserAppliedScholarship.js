import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

export const UserAppliedScholarship = sequelize.define('UserAppliedScholarship', {
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
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_applied_scholarships',
  timestamps: false,
});

export default UserAppliedScholarship;
