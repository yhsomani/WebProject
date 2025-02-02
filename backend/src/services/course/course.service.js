const { Course, UserCourseProgress } = require('../models');
const { Op } = require('sequelize');
const { generateCertificate } = require('../utils/certificateGenerator');

/**
 * Course Management Service
 * Handles course-related operations like enrollment, progress tracking, and certification
 */
class CourseService {
  /**
   * Multi-dimensional course filtering
   * @param {Object} filters - Filtering criteria
   * @returns {Array} - List of filtered courses
   */
  async getCourses(filters = {}) {
    const { 
      skillLevel, 
      minDuration, 
      maxDuration, 
      priceRange, 
      category,
      technology 
    } = filters;

    const whereConditions = {};

    if (skillLevel) {
      whereConditions.skillLevel = skillLevel;
    }

    if (minDuration && maxDuration) {
      whereConditions.duration = {
        [Op.between]: [minDuration, maxDuration]
      };
    }

    if (priceRange) {
      whereConditions.price = {
        [Op.between]: [priceRange.min, priceRange.max]
      };
    }

    if (category) {
      whereConditions.category = category;
    }

    if (technology) {
      whereConditions.technologies = {
        [Op.contains]: [technology]
      };
    }

    return await Course.findAll({
      where: whereConditions,
      include: [
        { model: UserCourseProgress, attributes: ['progress'] }
      ],
      order: [['rating', 'DESC']],
      limit: 50
    });
  }

  /**
   * Comprehensive course enrollment
   * @param {string} userId - User's unique identifier
   * @param {string} courseId - Course's unique identifier
   * @returns {Object} - Enrollment details
   */
  async enrollCourse(userId, courseId) {
    const course = await Course.findByPk(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    const existingEnrollment = await UserCourseProgress.findOne({
      where: { userId, courseId }
    });

    if (existingEnrollment) {
      throw new Error('Already enrolled in this course');
    }

    const enrollment = await UserCourseProgress.create({
      userId,
      courseId,
      progress: 0,
      startDate: new Date(),
      status: 'in_progress'
    });

    return enrollment;
  }

  /**
   * Advanced progress tracking
   * @param {string} userId - User's unique identifier
   * @param {string} courseId - Course's unique identifier
   * @param {Object} progressData - Progress data
   * @returns {Object} - Updated enrollment
   */
  async trackProgress(userId, courseId, progressData) {
    const { moduleId, completedPercentage } = progressData;

    const enrollment = await UserCourseProgress.findOne({
      where: { userId, courseId }
    });

    if (!enrollment) {
      throw new Error('Course enrollment not found');
    }

    // Update module-specific progress
    const updatedProgress = await enrollment.update({
      progress: completedPercentage,
      lastAccessedModule: moduleId,
      lastAccessedAt: new Date()
    });

    // Check course completion
    if (completedPercentage >= 100) {
      await this.completeCourse(userId, courseId);
    }

    return updatedProgress;
  }

  /**
   * Course completion and certification
   * @param {string} userId - User's unique identifier
   * @param {string} courseId - Course's unique identifier
   * @returns {Object} - Certificate details
   */
  async completeCourse(userId, courseId) {
    const enrollment = await UserCourseProgress.findOne({
      where: { 
        userId, 
        courseId,
        progress: 100 
      }
    });

    if (!enrollment) {
      throw new Error('Course not fully completed');
    }

    // Generate digital certificate
    const certificateData = await generateCertificate({
      userId,
      courseId,
      completionDate: new Date()
    });

    // Update enrollment status
    await enrollment.update({
      status: 'completed',
      certificateUrl: certificateData.url
    });

    return certificateData;
  }

  /**
   * Personalized course recommendations
   * @param {string} userId - User's unique identifier
   * @returns {Array} - List of recommended courses
   */
  async recommendCourses(userId) {
    // Implement recommendation logic based on:
    // 1. User's completed courses
    // 2. User's skill profile
    // 3. Trending courses
    // 4. Learning path progression
    
    const userCompletedCourses = await UserCourseProgress.findAll({
      where: { 
        userId, 
        status: 'completed' 
      }
    });

    const recommendedCourses = await Course.findAll({
      where: {
        id: {
          [Op.notIn]: userCompletedCourses.map(course => course.courseId)
        }
      },
      order: [['rating', 'DESC']],
      limit: 10
    });

    return recommendedCourses;
  }
}

module.exports = new CourseService();
