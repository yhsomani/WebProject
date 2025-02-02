const { Model } = require('sequelize');

class InternshipApplication extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'applicant'
    });
    this.belongsTo(models.Internship, {
      foreignKey: 'internshipId',
      as: 'internship'
    });
  }
}

module.exports = (sequelize, DataTypes) => {
  const InternshipApplicationModel = InternshipApplication.init({
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
    internshipId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'internships',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'under_review', 'accepted', 'rejected', 'withdrawn']]
      }
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [100, 2000]
      }
    },
    resume: {
      type: DataTypes.STRING, // URL to resume file
      allowNull: false
    },
    portfolio: {
      type: DataTypes.STRING // URL to portfolio
    },
    experience: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('experience');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('experience', JSON.stringify(value));
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
    reviewedAt: {
      type: DataTypes.DATE
    },
    reviewedBy: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    feedback: {
      type: DataTypes.TEXT
    },
    availability: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expectedStipend: {
      type: DataTypes.DECIMAL(10, 2)
    },
    interviewDate: {
      type: DataTypes.DATE
    },
    interviewFeedback: {
      type: DataTypes.TEXT
    },
    rejectionReason: {
      type: DataTypes.TEXT
    },
    withdrawalReason: {
      type: DataTypes.TEXT
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
    modelName: 'InternshipApplication',
    tableName: 'internship_applications',
    timestamps: true,
    uniqueKeys: {
      unique_user_internship: {
        fields: ['userId', 'internshipId']
      }
    }
  });

  return InternshipApplicationModel;
};
