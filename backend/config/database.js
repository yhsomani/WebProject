require('dotenv').config();
const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const logger = require('./logger');

// PostgreSQL configuration
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'learning_platform',
  username: 'postgres',
  password: 'root',
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// MongoDB configuration
const connectMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/learning_platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

// Test PostgreSQL connection
const testPostgresConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL connection has been established successfully');
  } catch (error) {
    logger.error('Unable to connect to PostgreSQL database:', error);
    process.exit(1);
  }
};

// Initialize databases
const initializeDatabases = async () => {
  await Promise.all([
    connectMongoDB(),
    testPostgresConnection()
  ]);
};

module.exports = {
  sequelize,
  mongoose,
  initializeDatabases
};
