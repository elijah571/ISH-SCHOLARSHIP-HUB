import { Op } from 'sequelize';
import { User, Activity } from '../../database/models/index.js';

export const userAdminRepo = {
  findAll: async ({ page = 1, limit = 10, search = '', role = '' }) => {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (role) where.role = role;

    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordTokenExpires'] },
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    return { users, total, page, limit, pages: Math.ceil(total / limit) };
  },

  findById: (id) =>
    User.findByPk(id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordTokenExpires'] },
    }),

  create: (data) => User.create(data),

  update: (id, data) =>
    User.update(data, { where: { id }, returning: true }).then(([, rows]) => rows[0]),

  delete: (id) => User.destroy({ where: { id } }),

  countUsers: () => User.count({ where: { role: 'user' } }),

  findByEmailExcluding: (email, excludeId) =>
    User.findOne({ where: { email, id: { [Op.ne]: excludeId } } }),
};

export const activityRepo = {
  create: (data) => Activity.create(data),

  findRecent: (limit = 10) =>
    Activity.findAll({ order: [['createdAt', 'DESC']], limit }),
};
