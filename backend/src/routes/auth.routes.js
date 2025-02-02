const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validate, schemas } = require('../utils/validation/validator');
const AppError = require('../utils/errors/AppError');
const { ApiResponse } = require('../utils/responses/apiResponse');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { getSequelize } = require('../models');

// Helper function to get User model
const getUserModel = () => {
  const sequelize = getSequelize();
  if (!sequelize) {
    throw new Error('Database not initialized');
  }
  return sequelize.models.User;
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Register user
router.post('/register', validate({
  name: schemas.userName.required(),
  email: schemas.userEmail.required(),
  password: schemas.userPassword.required(),
  role: schemas.userRole.required()
}), async (req, res, next) => {
  try {
    const User = getUserModel();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      throw AppError.conflict('User already exists with this email');
    }

    // Create user (password will be hashed by model hooks)
    const user = await User.create(req.body);

    // Generate token
    const token = generateToken(user);

    res.status(201).json(ApiResponse.success('User registered successfully', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }));
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', validate({
  email: schemas.userEmail.required(),
  password: schemas.userPassword.required()
}), async (req, res, next) => {
  try {
    const User = getUserModel();

    // Check if user exists
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.verifyPassword(req.body.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user);

    res.json(ApiResponse.success('Login successful', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }));
  } catch (error) {
    next(error);
  }
});

// Request password reset
router.post('/forgot-password', validate({
  email: schemas.userEmail.required()
}), async (req, res, next) => {
  try {
    const User = getUserModel();

    // Find user
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      throw AppError.notFound('No user found with this email address');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry
    });

    // In a real application, send email with reset link
    // For development, just return the token
    res.json(ApiResponse.success('Password reset instructions sent', {
      resetToken,
      message: 'In production, an email would be sent with reset instructions'
    }));
  } catch (error) {
    next(error);
  }
});

// Reset password
router.post('/reset-password', validate({
  token: schemas.resetToken.required(),
  password: schemas.userPassword.required()
}), async (req, res, next) => {
  try {
    const User = getUserModel();

    // Find user by reset token
    const user = await User.findOne({
      where: {
        resetPasswordToken: req.body.token,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      throw AppError.unauthorized('Invalid or expired reset token');
    }

    // Update password and clear reset token
    await user.update({
      password: req.body.password,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json(ApiResponse.success('Password has been reset successfully'));
  } catch (error) {
    next(error);
  }
});

// Change password (authenticated)
router.post('/change-password', validate({
  currentPassword: schemas.userPassword.required(),
  newPassword: schemas.userPassword.required()
}), async (req, res, next) => {
  try {
    const User = getUserModel();

    // Get user from token (assuming auth middleware sets req.user)
    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw AppError.unauthorized('User not found');
    }

    // Verify current password
    const isPasswordValid = await user.verifyPassword(req.body.currentPassword);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Current password is incorrect');
    }

    // Update password
    await user.update({ password: req.body.newPassword });

    res.json(ApiResponse.success('Password changed successfully'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
