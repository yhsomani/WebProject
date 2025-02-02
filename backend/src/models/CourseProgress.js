const { Model, DataTypes } = require('sequelize');

class CourseProgress extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    this.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  }
}

module.exports = (sequelize, DataTypes) => {
  CourseProgress.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    completedAt: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'in_progress',
      validate: {
        isIn: [['not_started', 'in_progress', 'completed', 'dropped']]
      }
    },
    currentModule: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    timeSpent: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 0
    },
    certificate: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'CourseProgress',
    tableName: 'course_progress',
    timestamps: true,
    uniqueKeys: {
      unique_user_course: {
        fields: ['userId', 'courseId']
      }
    }
  });

  return CourseProgress;
};
