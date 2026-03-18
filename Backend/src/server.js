import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDB } from './config/dataBase.js';
import { logger } from './utils/logger.js';

dotenv.config();

// Handle sync errors FIRST
process.on('uncaughtException', (err) => {
  logger.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on PORT: ${PORT}`);
    });

    // Handle async promise rejections
    process.on('unhandledRejection', (reason) => {
      logger.error('💥 Unhandled Rejection:', reason);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    logger.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();