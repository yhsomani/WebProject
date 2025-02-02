const authService = require('../services/auth/authentication.service');
const AppError = require('../utils/errors/AppError');
const { ApiResponse } = require('../utils/responses/apiResponse');
const logger = require('../config/logger');
const { User } = require('../models');

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(ApiResponse.success('User registered successfully', user));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { token, user } = await authService.login(req.body);
      res.status(200).json(ApiResponse.success('Login successful', { token, user }));
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      await authService.forgotPassword(req.body.email);
      res.status(200).json(ApiResponse.success('Password reset instructions sent to email'));
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      await authService.resetPassword(req.params.token, req.body.password);
      res.status(200).json(ApiResponse.success('Password reset successful'));
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      await authService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json(ApiResponse.success('Password changed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getUserProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires', 'verificationToken'] },
        include: [
          {
            association: 'enrolledCourses',
            through: { attributes: [] },
            include: [{
              association: 'instructor',
              attributes: ['id', 'name', 'email']
            }]
          },
          {
            association: 'instructedCourses',
            include: [{
              association: 'students',
              attributes: ['id', 'name', 'email'],
              through: { attributes: [] }
            }]
          },
          {
            association: 'internshipApplications',
            include: [{
              association: 'internship',
              include: [{
                association: 'company',
                attributes: ['id', 'name', 'industry']
              }]
            }]
          }
        ]
      });

      if (!user) {
        throw AppError.notFound('User not found');
      }

      // Add additional user stats
      const userStats = {
        totalEnrolledCourses: user.enrolledCourses.length,
        totalInstructedCourses: user.instructedCourses.length,
        totalInternshipApplications: user.internshipApplications.length,
        activeInternshipApplications: user.internshipApplications.filter(app => app.status === 'pending').length
      };

      const enrichedUser = {
        ...user.toJSON(),
        stats: userStats
      };

      res.status(200).json(ApiResponse.success('Profile retrieved successfully', enrichedUser));
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        throw AppError.notFound('User not found');
      }

      // Filter out sensitive fields that shouldn't be updated directly
      const { password, role, status, ...updateData } = req.body;
      
      const updatedUser = await user.update(updateData);
      
      // Remove sensitive data from response
      const { password: _, resetPasswordToken: __, resetPasswordExpires: ___, ...safeUser } = updatedUser.toJSON();
      
      res.status(200).json(ApiResponse.success('Profile updated successfully', safeUser));
    } catch (error) {
      next(error);
    }
  }

  async googleAuthentication(req, res, next) {
    try {
      const { idToken } = req.body;
      const userData = await authService.verifyGoogleToken(idToken);
      const { token, user } = await authService.loginWithGoogle(userData);
      res.status(200).json(ApiResponse.success('Google authentication successful', { token, user }));
    } catch (error) {
      next(error);
    }
  }

  async linkedinAuthentication(req, res, next) {
    try {
      const { accessToken } = req.body;
      const { user, token } = await authService.linkedinLogin(accessToken);

      res.status(200).json({
        message: 'LinkedIn authentication successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      logger.error('LinkedIn Auth Error:', error);
      res.status(401).json({ 
        message: error.message || 'LinkedIn authentication failed' 
      });
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      await authService.verifyEmailToken(token);

      res.status(200).json({
        message: 'Email verified successfully'
      });
    } catch (error) {
      logger.error('Email Verification Error:', error);
      res.status(400).json({ 
        message: error.message || 'Email verification failed' 
      });
    }
  }
}

module.exports = new AuthController();
