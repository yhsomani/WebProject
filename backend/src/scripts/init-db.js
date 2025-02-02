const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const logger = require('../config/logger');
const { sequelize, mongoConfig, postgresConfig } = require('../config/database.config');

async function testPostgresConnection() {
    try {
        await sequelize.authenticate();
        logger.info('PostgreSQL Connection has been established successfully.');
        
        // Test query
        await sequelize.query('SELECT NOW()');
        logger.info('PostgreSQL Query executed successfully.');
        
        return true;
    } catch (error) {
        logger.error('Unable to connect to PostgreSQL:', error);
        return false;
    }
}

async function testMongoConnection() {
    try {
        const env = process.env.NODE_ENV || 'development';
        const { uri, options } = mongoConfig[env];
        
        await mongoose.connect(uri, options);
        logger.info('MongoDB Connection has been established successfully.');
        
        // Test query
        const collections = await mongoose.connection.db.listCollections().toArray();
        logger.info(`MongoDB Collections found: ${collections.length}`);
        
        return true;
    } catch (error) {
        logger.error('Unable to connect to MongoDB:', error);
        return false;
    }
}

async function initializeDatabases() {
    logger.info('Starting database initialization...');
    
    // Test PostgreSQL
    logger.info('Testing PostgreSQL connection...');
    const postgresConnected = await testPostgresConnection();
    
    // Test MongoDB
    logger.info('Testing MongoDB connection...');
    const mongoConnected = await testMongoConnection();
    
    if (postgresConnected && mongoConnected) {
        logger.info('All database connections established successfully!');
        logger.info(`
PostgreSQL Connection Info:
- Host: ${process.env.POSTGRES_HOST || 'localhost'}
- Port: ${process.env.POSTGRES_PORT || 5432}
- Database: ${process.env.POSTGRES_DB || 'learning_platform'}

MongoDB Connection Info:
- URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/learning_platform'}
        `);
        
        return true;
    } else {
        logger.error('Failed to establish all database connections');
        return false;
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabases()
        .then(success => {
            if (!success) {
                process.exit(1);
            }
            process.exit(0);
        })
        .catch(error => {
            logger.error('Database initialization failed:', error);
            process.exit(1);
        });
}

module.exports = {
    testPostgresConnection,
    testMongoConnection,
    initializeDatabases
};
