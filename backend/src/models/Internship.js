const { Model } = require('sequelize');

class Internship extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'instructorId',
      as: 'instructor'
    });
    this.hasMany(models.InternshipApplication, {
      foreignKey: 'internshipId',
      as: 'applications'
    });
  }
}

module.exports = (sequelize, DataTypes) => {
  const InternshipModel = Internship.init({
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
        len: [20, 2000]
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['remote', 'onsite', 'hybrid']]
      }
    },
    duration: {
      type: DataTypes.INTEGER, // in weeks
      allowNull: false,
      validate: {
        min: 1
      }
    },
    stipend: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    skills: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('skills');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('skills', JSON.stringify(value));
      }
    },
    requirements: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('requirements');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('requirements', JSON.stringify(value));
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open',
      validate: {
        isIn: [['draft', 'open', 'closed', 'archived']]
      }
    },
    applicationDeadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    positions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    applicationCount: {
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
    modelName: 'Internship',
    tableName: 'internships',
    timestamps: true
  });

  return InternshipModel;
};
