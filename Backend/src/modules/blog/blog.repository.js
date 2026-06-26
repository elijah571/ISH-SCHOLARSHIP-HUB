import { Op } from 'sequelize';
import { Blog, User } from '../../database/models/index.js';

const creatorAttrs = { model: User, as: 'createdBy', attributes: ['id', 'fullName', 'email'] };

export const blogRepo = {
  findById: (id) => Blog.findByPk(id, { include: [creatorAttrs] }),

  findAll: async ({ page = 1, limit = 10, search, publishedOnly = true }) => {
    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.max(Number(limit) || 10, 1);
    const offset = (parsedPage - 1) * parsedLimit;

    const where = {};
    if (publishedOnly) where.published = true;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows: blogs, count: total } = await Blog.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit: parsedLimit,
    });

    return { blogs, total, page: parsedPage, limit: parsedLimit, pages: Math.ceil(total / parsedLimit) };
  },

  create: (data) => Blog.create(data),

  update: (id, data) =>
    Blog.update(data, { where: { id }, returning: true }).then(([, rows]) => rows[0]),

  delete: (id) => Blog.destroy({ where: { id } }),
};
