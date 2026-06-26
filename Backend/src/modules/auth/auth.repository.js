import { Op } from 'sequelize';
import { User, UserSession, UserSavedScholarship, UserAppliedScholarship } from '../../database/models/index.js';

export const userRepo = {
  findByEmail: (email) => User.findOne({ where: { email: email.toLowerCase() } }),

  findById: (id) =>
    User.findByPk(id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordTokenExpires'] },
    }),

  findByIdWithPassword: (id) => User.findByPk(id),

  findByResetToken: (hashedToken) =>
    User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpires: { [Op.gt]: new Date() },
      },
    }),

  create: (data) => User.create(data),

  update: (id, data) => User.update(data, { where: { id }, returning: true }).then(([, rows]) => rows[0]),

  countSessions: (userId) => UserSession.count({ where: { userId } }),

  getSessions: (userId) => UserSession.findAll({ where: { userId }, order: [['createdAt', 'ASC']] }),

  createSession: (data) => UserSession.create(data),

  deleteSession: (id) => UserSession.destroy({ where: { id } }),

  deleteSessionByToken: (userId, refreshToken) =>
    UserSession.destroy({ where: { userId, refreshToken } }),

  deleteAllSessions: (userId) => UserSession.destroy({ where: { userId } }),

  findSessionByToken: (refreshToken) => UserSession.findOne({ where: { refreshToken } }),

  updateSession: (id, data) => UserSession.update(data, { where: { id } }),
};

export const scholarshipUserRepo = {
  findSaved: (userId) =>
    UserSavedScholarship.findAll({ where: { userId }, order: [['savedAt', 'DESC']] }),

  findSavedOne: (userId, scholarshipId) =>
    UserSavedScholarship.findOne({ where: { userId, scholarshipId } }),

  save: (userId, scholarshipId) => UserSavedScholarship.create({ userId, scholarshipId }),

  unsave: (userId, scholarshipId) =>
    UserSavedScholarship.destroy({ where: { userId, scholarshipId } }),

  findApplied: (userId) =>
    UserAppliedScholarship.findAll({ where: { userId }, order: [['appliedAt', 'DESC']] }),

  findAppliedOne: (userId, scholarshipId) =>
    UserAppliedScholarship.findOne({ where: { userId, scholarshipId } }),

  apply: (userId, scholarshipId) => UserAppliedScholarship.create({ userId, scholarshipId }),
};
