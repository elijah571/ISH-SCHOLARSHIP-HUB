import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { connectDB } from './config/dataBase.js';
import { logger } from './utils/logger.js';
import { initializeChatSocket } from './services/chat.socket.js';

dotenv.config();

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

// Initialize chat socket handlers
initializeChatSocket(io);

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      logger.info(`Server running on PORT: ${PORT}`);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
