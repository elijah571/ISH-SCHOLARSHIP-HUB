import { Op } from 'sequelize';
import { Blog, User } from '../../database/models/index.js';

const creatorAttrs = { model: User, as: 'createdBy', attributes: ['id', 'fullName', 'email'] };

export const blogRepo = {
  findById: (id) => Blog.findByPk(id, { include: [creatorAttrs] }),

  findAll: async ({ page = 1, limit = 10, search, publishedOnly = true, sort = 'newest' }) => {
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

    const ORDER_MAP = {
      newest: [['createdAt', 'DESC']],
      oldest: [['createdAt', 'ASC']],
      title: [['title', 'ASC']],
    };
    const order = ORDER_MAP[sort] || ORDER_MAP.newest;

    const { rows: blogs, count: total } = await Blog.findAndCountAll({
      where,
      order,
      offset,
      limit: parsedLimit,
    });

    const totalPages = Math.ceil(total / parsedLimit);
    return { blogs, total, page: parsedPage, limit: parsedLimit, totalPages, pages: totalPages };
  },

  create: (data) => Blog.create(data),

  update: (id, data) =>
    Blog.update(data, { where: { id }, returning: true }).then(([, rows]) => rows[0]),

  delete: (id) => Blog.destroy({ where: { id } }),
};
