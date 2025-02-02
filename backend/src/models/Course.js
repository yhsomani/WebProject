const { Model } = require('sequelize');

class Course extends Model {
  static associate(models) {
    // Define associations
    this.belongsTo(models.User, {
      foreignKey: 'instructorId',
      as: 'instructor'
    });
    this.belongsToMany(models.User, {
      through: models.CourseProgress,
      foreignKey: 'courseId',
      as: 'enrolledStudents'
    });
    this.hasMany(models.CourseProgress, {
      foreignKey: 'courseId',
      as: 'progress'
    });
  }
}

module.exports = (sequelize, DataTypes) => {
  const CourseModel = Course.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [20, 1000]
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['beginner', 'intermediate', 'advanced']]
      }
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false,
      validate: {
        min: 1
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    thumbnail: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'draft',
      validate: {
        isIn: [['draft', 'published', 'archived']]
      }
    },
    enrollmentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
        max: 5
      }
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    instructorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true
  });

  return CourseModel;
};
