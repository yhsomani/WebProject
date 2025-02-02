const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const logger = require('./logger');

// Load environment variables
require('dotenv').config();

// Common database options
const commonOptions = {
  logging: (msg) => logger.debug(msg)
};

// PostgreSQL Configuration
const postgresConfig = {
  development: {
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'learning_platform',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    ...commonOptions,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'learning_platform_test',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    ...commonOptions
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    ...commonOptions,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

// MongoDB Configuration
const mongoConfig = {
  development: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/learning_platform',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true
    }
  },
  test: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/learning_platform_test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  production: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true
    }
  }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Create database instances
const sequelize = new Sequelize(postgresConfig[env]);
const mongoUri = mongoConfig[env].uri;
const mongoOptions = mongoConfig[env].options;

// Database connection initialization
async function initializeDatabases() {
  try {
    // Test PostgreSQL connection
    await sequelize.authenticate();
    logger.info('PostgreSQL connection established successfully');

    // Test MongoDB connection
    await mongoose.connect(mongoUri, mongoOptions);
    logger.info('MongoDB connection established successfully');

    return true;
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
}

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection lost');
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    await sequelize.close();
    logger.info('Database connections closed due to application termination');
    process.exit(0);
  } catch (error) {
    logger.error('Error during database disconnection:', error);
    process.exit(1);
  }
});

module.exports = {
  sequelize,
  mongoose,
  initializeDatabases,
  postgresConfig,
  mongoConfig
};
