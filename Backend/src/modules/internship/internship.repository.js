import { Op } from 'sequelize';
import { Internship, User } from '../../database/models/index.js';

const creatorAttrs = { model: User, as: 'createdBy', attributes: ['id', 'fullName', 'email'] };

export const internshipRepo = {
  findById: (id) => Internship.findByPk(id, { include: [creatorAttrs] }),

  findAll: async ({ page = 1, limit = 10, search, country, type, deadline, startDate, endDate, sort = 'newest' }) => {
    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.max(Number(limit) || 10, 1);
    const offset = (parsedPage - 1) * parsedLimit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { institution: { [Op.iLike]: `%${search}%` } },
        { country: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (country) where.country = { [Op.iLike]: `%${country}%` };
    if (type) where.type = type;
    if (deadline) where.deadline = { [Op.gte]: new Date(deadline) };
    if (startDate) where.startDate = { [Op.gte]: new Date(startDate) };
    if (endDate) where.endDate = { [Op.gte]: new Date(endDate) };

    const ORDER_MAP = {
      newest: [['createdAt', 'DESC']],
      oldest: [['createdAt', 'ASC']],
      deadline: [['deadline', 'ASC']],
      title: [['title', 'ASC']],
      name: [['title', 'ASC']],
    };
    const order = ORDER_MAP[sort] || ORDER_MAP.newest;

    const { rows: internships, count: total } = await Internship.findAndCountAll({
      where,
      order,
      offset,
      limit: parsedLimit,
    });

    const totalPages = Math.ceil(total / parsedLimit);
    return { internships, total, page: parsedPage, limit: parsedLimit, totalPages, pages: totalPages };
  },

  create: (data) => Internship.create(data),

  update: (id, data) =>
    Internship.update(data, { where: { id }, returning: true }).then(([, rows]) => rows[0]),

  delete: (id) => Internship.destroy({ where: { id } }),
};
