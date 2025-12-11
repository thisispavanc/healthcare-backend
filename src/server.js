const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const db = require('./config/database');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Function to start the server
const startServer = async () => {
  try {
    // Test database connection
    await db.raw('SELECT 1+1 as result');
    logger.info('✅ Database connected successfully');
    
    // Start server
    const server = app.listen(config.app.port, () => {
      logger.info(`🚀 PAA Healthcare API Server running on port ${config.app.port}`);
      logger.info(`📍 Environment: ${config.app.env}`);
      logger.info(`🔗 Health check: http://localhost:${config.app.port}/api/health`);
      logger.info(`📚 API info: http://localhost:${config.app.port}/api/info`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(() => {
        logger.info('✅ HTTP server closed');
        
        // Close database connection
        db.destroy(() => {
          logger.info('✅ Database connection closed');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();