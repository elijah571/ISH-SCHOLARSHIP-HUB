import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger.js';

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASSWORD,
  DB_NAME,
  NODE_ENV = 'development',
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  dialect: 'postgres',
  logging: NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  dialectOptions: NODE_ENV === 'production' ? {
    ssl: { require: true, rejectUnauthorized: false },
  } : {},
  pool: {
    max: 10,
    min: 2,
    acquire: 30_000,
    idle: 10_000,
  },
  define: {
    underscored: false,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

export const connectDB = async () => {
  await sequelize.authenticate();
  logger.info('PostgreSQL connected via Sequelize');
  await sequelize.sync({ alter: true });
  logger.info('Database schema synced');
};

export default sequelize;
