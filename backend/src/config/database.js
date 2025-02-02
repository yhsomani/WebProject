const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const logger = require('./logger');

// SQLite configuration
const sqliteConfig = {
  dialect: 'sqlite',
  storage: process.env.SQLITE_PATH || ':memory:',
  logging: (msg) => logger.debug(msg)
};

// PostgreSQL configuration
const postgresConfig = {
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB || 'learning_platform',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3
  }
};

// MongoDB configuration
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning_platform';

// Initialize databases with fallback to SQLite
const initializeDatabases = async () => {
  try {
    let sequelize;

    // Check if we should use SQLite
    if (process.env.USE_SQLITE === 'true') {
      sequelize = new Sequelize(sqliteConfig);
      logger.info('Using SQLite database');
    } else {
      // Try PostgreSQL first
      try {
        sequelize = new Sequelize(postgresConfig);
        await sequelize.authenticate();
        logger.info('PostgreSQL connection established successfully.');
      } catch (pgError) {
        logger.warn('PostgreSQL connection failed, falling back to SQLite:', pgError.message);
        sequelize = new Sequelize(sqliteConfig);
      }
    }

    // Test the connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Set the global sequelize instance
    global.sequelize = sequelize;
    module.exports.sequelize = sequelize;

    // Skip MongoDB if specified
    if (process.env.SKIP_MONGODB === 'true') {
      logger.info('MongoDB connection skipped.');
    } else {
      try {
        await mongoose.connect(mongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        logger.info('MongoDB connection established successfully.');
      } catch (mongoError) {
        logger.warn('MongoDB connection failed:', mongoError.message);
      }
    }

    return true;
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
};

// Disconnect function for graceful shutdown
const disconnect = async () => {
  try {
    if (global.sequelize) {
      await global.sequelize.close();
      logger.info('SQL database connection closed.');
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed.');
    }
  } catch (error) {
    logger.error('Error closing database connections:', error);
    throw error;
  }
};

module.exports = {
  sequelize: null, // Will be set after initialization
  mongoose,
  initializeDatabases,
  disconnect
};
