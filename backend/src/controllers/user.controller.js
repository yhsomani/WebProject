const { ApiResponse } = require('../utils/responses/apiResponse');
const AppError = require('../utils/errors/AppError');
const { User, Course, CourseProgress, Internship, InternshipApplication } = require('../models');

class UserController {
  // Get user profile
  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.json(new ApiResponse(true, 'Profile retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      await user.update(req.body);
      res.json(new ApiResponse(true, 'Profile updated successfully', user));
    } catch (error) {
      next(error);
    }
  }

  // Get enrolled courses
  async getEnrolledCourses(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Course,
          through: CourseProgress,
          as: 'enrolledCourses'
        }]
      });
      res.json(new ApiResponse(true, 'Enrolled courses retrieved successfully', user.enrolledCourses));
    } catch (error) {
      next(error);
    }
  }

  // Get course progress
  async getCourseProgress(req, res, next) {
    try {
      const progress = await CourseProgress.findOne({
        where: {
          userId: req.user.id,
          courseId: req.params.courseId
        }
      });
      if (!progress) {
        throw new AppError('Course progress not found', 404);
      }
      res.json(new ApiResponse(true, 'Course progress retrieved successfully', progress));
    } catch (error) {
      next(error);
    }
  }

  // Get internship applications
  async getInternshipApplications(req, res, next) {
    try {
      const applications = await InternshipApplication.findAll({
        where: { userId: req.user.id },
        include: [{
          model: Internship,
          include: [{
            model: User,
            as: 'employer',
            attributes: ['id', 'name']
          }]
        }]
      });
      res.json(new ApiResponse(true, 'Applications retrieved successfully', applications));
    } catch (error) {
      next(error);
    }
  }

  // Admin routes
  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll();
      res.json(new ApiResponse(true, 'Users retrieved successfully', users));
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await User.findByPk(req.params.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.json(new ApiResponse(true, 'User retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await User.findByPk(req.params.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      await user.update(req.body);
      res.json(new ApiResponse(true, 'User updated successfully', user));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await User.findByPk(req.params.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      await user.destroy();
      res.json(new ApiResponse(true, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
