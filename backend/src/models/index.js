const { Sequelize, DataTypes } = require('sequelize');
const logger = require('../config/logger');
const { initializeDatabases } = require('../config/database');

// Import model definitions
const defineUser = require('./User');
const defineCourse = require('./Course');
const defineInternship = require('./Internship');
const defineCourseProgress = require('./CourseProgress');
const defineInternshipApplication = require('./InternshipApplication');

// Initialize models
const initializeModels = (sequelize) => {
  // Initialize models
  const models = {
    User: defineUser(sequelize, DataTypes),
    Course: defineCourse(sequelize, DataTypes),
    Internship: defineInternship(sequelize, DataTypes),
    CourseProgress: defineCourseProgress(sequelize, DataTypes),
    InternshipApplication: defineInternshipApplication(sequelize, DataTypes)
  };

  // Set up associations
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  return models;
};

// Get the sequelize instance (could be PostgreSQL or SQLite)
const getSequelize = () => {
  if (global.sequelize) {
    return global.sequelize;
  }
  return null;
};

// Initialize database and models
const init = async () => {
  // Initialize database connections
  await initializeDatabases();

  // Get sequelize instance
  const sequelize = getSequelize();
  if (!sequelize) {
    throw new Error('No database connection available');
  }

  // Initialize models
  const models = initializeModels(sequelize);

  // Sync database in development
  if (process.env.NODE_ENV === 'development') {
    try {
      await sequelize.sync({ force: true }); // Using force:true for development
      logger.info('Database synced successfully');
      
      // Create default admin user
      await models.User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123', // This will be hashed by the model hooks
        role: 'admin'
      });
      logger.info('Default admin user created');
      
    } catch (error) {
      logger.error('Error syncing database:', error.message);
    }
  }

  return {
    sequelize,
    ...models
  };
};

module.exports = {
  init,
  getSequelize
};
