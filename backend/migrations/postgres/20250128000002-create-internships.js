'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('internships', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      company: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      durationWeeks: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      skillsRequired: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      stipend: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      applicationDeadline: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'closed', 'filled'),
        defaultValue: 'active'
      },
      companyId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('internships', ['category']);
    await queryInterface.addIndex('internships', ['company']);
    await queryInterface.addIndex('internships', ['status']);
    await queryInterface.addIndex('internships', ['companyId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('internships');
  }
};
