import { Op, fn, col, literal } from 'sequelize';
import { Scholarship, User, UserSavedScholarship, UserAppliedScholarship } from '../../database/models/index.js';

const creatorAttrs = { model: User, as: 'createdBy', attributes: ['id', 'fullName', 'email'] };

export const scholarshipRepo = {
  findById: (id) =>
    Scholarship.findByPk(id, { include: [creatorAttrs] }),

  findAll: async ({ page = 1, limit = 10, search, country, funding_type, deadline,
    field_of_study, location, university, tuition_fees, format, attendance, degree_type,
    special_programme, sort = 'newest' }) => {
    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.max(Number(limit) || 10, 1);
    const offset = (parsedPage - 1) * parsedLimit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { country: { [Op.iLike]: `%${search}%` } },
        { host: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (country) where.country = { [Op.iLike]: `%${country}%` };
    if (funding_type) where.fundingType = { [Op.iLike]: `%${funding_type}%` };
    if (deadline) where.deadline = { [Op.gte]: new Date(deadline) };
    if (field_of_study) where.fieldOfStudy = { [Op.iLike]: `%${field_of_study}%` };
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (university) where.university = { [Op.iLike]: `%${university}%` };
    if (tuition_fees) where.tuitionFees = { [Op.iLike]: `%${tuition_fees}%` };
    if (format) where.format = { [Op.iLike]: `%${format}%` };
    if (attendance) where.attendance = { [Op.iLike]: `%${attendance}%` };
    if (degree_type) where.degreeType = { [Op.iLike]: `%${degree_type}%` };
    if (special_programme) where.specialProgramme = { [Op.iLike]: `%${special_programme}%` };

    const ORDER_MAP = {
      newest: [['createdAt', 'DESC']],
      oldest: [['createdAt', 'ASC']],
      deadline: [['deadline', 'ASC']],
      title: [['title', 'ASC']],
      name: [['title', 'ASC']],
      amount: [['amount', 'ASC']],
    };
    const order = ORDER_MAP[sort] || ORDER_MAP.newest;

    const { rows: scholarships, count: total } = await Scholarship.findAndCountAll({
      where,
      order,
      offset,
      limit: parsedLimit,
    });

    const totalPages = Math.ceil(total / parsedLimit);
    return { scholarships, total, page: parsedPage, limit: parsedLimit, totalPages, pages: totalPages };
  },

  getCountries: () =>
    Scholarship.findAll({
      attributes: ['country', [fn('COUNT', col('country')), 'count']],
      where: { country: { [Op.ne]: '' } },
      group: ['country'],
      order: [[literal('count'), 'DESC']],
      raw: true,
    }),

  create: (data) => Scholarship.create(data),

  update: (id, data) =>
    Scholarship.update(data, { where: { id }, returning: true }).then(([, rows]) => rows[0]),

  delete: (id) => Scholarship.destroy({ where: { id } }),
};
