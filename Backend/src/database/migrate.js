/**
 * Run all migrations in order.
 * Usage: node src/database/migrate.js
 */
import 'dotenv/config';
import { sequelize } from './index.js';

// Load models to register associations before sync
import './models/index.js';

const run = async () => {
  try {
    // sync({ alter: true }) will create missing tables + add missing columns
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

run();
