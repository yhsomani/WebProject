const logger = require('../config/logger');
const { Course, User } = require('../models');
const { ApiResponse, messages } = require('../utils/responses/apiResponse');
const AppError = require('../utils/errors/AppError');
const { paginateResults } = require('../utils/pagination');

class CourseController {
  static async getAllCourses(req, res, next) {
    try {
      const { page = 1, limit = 10, search, sort, filter } = req.query;
      
      // Build query
      let query = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (filter) {
        const filters = JSON.parse(filter);
        query = { ...query, ...filters };
      }

      // Execute query with pagination
      const { results, total } = await paginateResults(Course, query, {
        page,
        limit,
        sort,
        populate: [
          { path: 'instructor', select: 'name email' },
          { path: 'students', select: 'name email' }
        ]
      });

      res.status(200).json(
        ApiResponse.paginated(messages.LISTED, results, page, limit, total)
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCourseById(req, res, next) {
    try {
      const course = await Course.findById(req.params.id)
        .populate('instructor', 'name email')
        .populate('students', 'name email');
      
      if (!course) {
        throw AppError.notFound(messages.NOT_FOUND);
      }

      res.status(200).json(
        ApiResponse.success(messages.FETCHED, course)
      );
    } catch (error) {
      next(error);
    }
  }

  static async createCourse(req, res, next) {
    try {
      const course = await Course.create({
        ...req.body,
        instructor: req.user.id
      });

      // Populate instructor details
      await course.populate('instructor', 'name email');

      res.status(201).json(
        ApiResponse.success(messages.COURSE_CREATED, course)
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateCourse(req, res, next) {
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        throw AppError.notFound(messages.NOT_FOUND);
      }

      // Check if user is the instructor
      if (course.instructor.toString() !== req.user.id) {
        throw AppError.forbidden(messages.FORBIDDEN);
      }

      // Update course
      Object.assign(course, req.body);
      await course.save();
      
      // Populate instructor details
      await course.populate('instructor', 'name email');

      res.status(200).json(
        ApiResponse.success(messages.COURSE_UPDATED, course)
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteCourse(req, res, next) {
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        throw AppError.notFound(messages.NOT_FOUND);
      }

      // Check if user is the instructor
      if (course.instructor.toString() !== req.user.id) {
        throw AppError.forbidden(messages.FORBIDDEN);
      }

      await course.remove();

      res.status(200).json(
        ApiResponse.success(messages.COURSE_DELETED)
      );
    } catch (error) {
      next(error);
    }
  }

  static async enrollCourse(req, res, next) {
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        throw AppError.notFound(messages.NOT_FOUND);
      }

      // Check if user is already enrolled
      if (course.students.includes(req.user.id)) {
        throw AppError.badRequest('You are already enrolled in this course');
      }

      // Add student to course
      course.students.push(req.user.id);
      await course.save();

      // Add course to user's enrolled courses
      const user = await User.findById(req.user.id);
      user.enrolledCourses.push(course.id);
      await user.save();

      res.status(200).json(
        ApiResponse.success(messages.COURSE_ENROLLED, course)
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CourseController;
