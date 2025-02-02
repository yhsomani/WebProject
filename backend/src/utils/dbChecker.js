const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const config = require('../config');
const logger = require('./logger');

class DatabaseChecker {
  static async checkPostgres() {
    const sequelize = new Sequelize({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      dialect: 'postgres',
      logging: false,
      ssl: process.env.DB_SSL === 'true',
      dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    });

    try {
      await sequelize.authenticate();
      logger.info('PostgreSQL Connection: OK');
      return true;
    } catch (error) {
      logger.error('PostgreSQL Connection Error:', error.message);
      return false;
    } finally {
      await sequelize.close();
    }
  }

  static async checkMongoDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info('MongoDB Connection: OK');
      return true;
    } catch (error) {
      logger.error('MongoDB Connection Error:', error.message);
      return false;
    } finally {
      await mongoose.connection.close();
    }
  }

  static async checkAll() {
    const postgresStatus = await this.checkPostgres();
    const mongoStatus = await this.checkMongoDB();
    return { postgresStatus, mongoStatus };
  }
}

module.exports = DatabaseChecker; 