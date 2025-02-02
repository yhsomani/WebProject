require('dotenv').config();
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const initializeApp = require('./app');
const { disconnect } = require('./config/database');
const logger = require('./config/logger');

const PORT = process.env.PORT || 4000;

// Graceful shutdown handler
const gracefulShutdown = async (server) => {
  try {
    logger.info('Received shutdown signal. Starting graceful shutdown...');
    
    // Close server
    server.close(() => {
      logger.info('Server closed. No new connections will be accepted.');
    });

    // Disconnect from databases
    await disconnect();
    logger.info('Database connections closed.');

    // Exit process
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Start server function
const startServer = async () => {
  try {
    // Initialize application
    const app = await initializeApp();

    // Create HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`Worker ${process.pid} started on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      switch (error.code) {
        case 'EACCES':
          logger.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`Port ${PORT} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Handle process signals
    process.on('SIGTERM', () => gracefulShutdown(server));
    process.on('SIGINT', () => gracefulShutdown(server));

    // Handle uncaught exceptions and rejections
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown(server);
    });

    process.on('unhandledRejection', (error) => {
      logger.error('Unhandled Rejection:', error);
      gracefulShutdown(server);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Implement clustering in production
if (process.env.NODE_ENV === 'production' && cluster.isMaster) {
  logger.info(`Master ${process.pid} is running`);

  // Fork workers based on CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker events
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  startServer();
}
