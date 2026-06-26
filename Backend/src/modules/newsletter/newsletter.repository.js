import { Newsletter } from '../../database/models/index.js';

export const newsletterRepo = {
  findByEmail: (email) => Newsletter.findOne({ where: { email } }),

  create: (email) => Newsletter.create({ email, isActive: true }),

  update: (email, data) => Newsletter.update(data, { where: { email }, returning: true }).then(([, rows]) => rows[0]),

  findAllActive: () => Newsletter.findAll({ where: { isActive: true }, attributes: ['email'] }),
};
