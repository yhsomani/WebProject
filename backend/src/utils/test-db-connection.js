require('dotenv').config();
const mongoose = require('mongoose');
const { testConnection: testPostgres } = require('../config/database.config');
const logger = require('../config/logger');

async function testDatabaseConnections() {
  // Test PostgreSQL connection
  logger.info('Testing PostgreSQL connection...');
  const postgresConnected = await testPostgres();
  
  // Test MongoDB connection
  logger.info('Testing MongoDB connection...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('MongoDB connection has been established successfully.');
    await mongoose.connection.close();
    logger.info('MongoDB connection closed.');
  } catch (error) {
    logger.error('Unable to connect to MongoDB:', error);
    process.exit(1);
  }

  // Exit based on connection results
  if (!postgresConnected) {
    logger.error('Database connection test failed. Please check your configuration.');
    process.exit(1);
  }

  logger.info('All database connections tested successfully!');
  process.exit(0);
}

// Run the tests
testDatabaseConnections();
