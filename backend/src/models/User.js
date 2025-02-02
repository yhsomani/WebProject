const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const { v4: uuidv4 } = require('uuid');

class User extends Model {
  static associate(models) {
    // Relationships
    this.hasMany(models.Course, { 
      foreignKey: 'instructorId', 
      as: 'instructedCourses' 
    });
    this.belongsToMany(models.Course, { 
      through: models.CourseProgress,
      foreignKey: 'userId',
      as: 'enrolledCourses'
    });
    this.hasMany(models.CourseProgress, {
      foreignKey: 'userId',
      as: 'courseProgress'
    });
    this.hasMany(models.Internship, {
      foreignKey: 'instructorId',
      as: 'postedInternships'
    });
    this.hasMany(models.InternshipApplication, {
      foreignKey: 'userId',
      as: 'internshipApplications'
    });
  }

  // Password verification
  async verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  // Generate JWT Token
  generateAuthToken() {
    const payload = {
      id: this.id,
      email: this.email,
      role: this.role
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', { 
      expiresIn: process.env.JWT_EXPIRATION || '1d'
    });
  }

  // Sanitize user data for response
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    delete values.resetPasswordToken;
    delete values.resetPasswordExpires;
    delete values.verificationToken;
    return values;
  }
}

module.exports = (sequelize, DataTypes) => {
  const UserModel = User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'student',
      allowNull: false,
      validate: {
        isIn: [['student', 'instructor', 'admin']]
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        is: /^\+?[1-9]\d{1,14}$/
      }
    },
    bio: {
      type: DataTypes.TEXT
    },
    avatar: {
      type: DataTypes.STRING
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING
    },
    resetPasswordToken: {
      type: DataTypes.STRING
    },
    resetPasswordExpires: {
      type: DataTypes.DATE
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive', 'suspended']]
      }
    },
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  return UserModel;
};
