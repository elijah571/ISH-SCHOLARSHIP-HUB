import { Op } from 'sequelize';
import { Internship, User } from '../../database/models/index.js';

const creatorAttrs = { model: User, as: 'createdBy', attributes: ['id', 'fullName', 'email'] };

export const internshipRepo = {
  findById: (id) => Internship.findByPk(id, { include: [creatorAttrs] }),

  findAll: async ({ page = 1, limit = 10, search, country, type, deadline, startDate, endDate }) => {
    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (country) where.country = country;
    if (type) where.type = type;
    if (deadline) where.deadline = { [Op.gte]: new Date(deadline) };
    if (startDate) where.startDate = { [Op.gte]: new Date(startDate) };
    if (endDate) where.endDate = { [Op.gte]: new Date(endDate) };

    const offset = (page - 1) * limit;
    const { rows: internships, count: total } = await Internship.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit: Number(limit),
    });

    return { internships, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) };
  },

  create: (data) => Internship.create(data),

  update: (id, data) =>
    Internship.update(data, { where: { id }, returning: true }).then(([, rows]) => rows[0]),

  delete: (id) => Internship.destroy({ where: { id } }),
};
