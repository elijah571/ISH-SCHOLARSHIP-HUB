import { sequelize } from '../src/database/index.js';
import '../src/database/models/index.js';

export async function startDb() {
  await sequelize.sync({ force: true });
}

export async function stopDb() {
  await sequelize.close();
}

export async function clearDb() {
  await sequelize.truncate({ cascade: true, restartIdentity: true });
}
