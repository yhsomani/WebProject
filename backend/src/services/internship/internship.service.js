const { Internship, InternshipApplication, User } = require('../models');

/**
 * Internship Management Service
 * Handles internship-related operations like application, tracking, and feedback
 */
class InternshipService {
  /**
   * Create a new internship listing
   * @param {Object} internshipData - Internship details
   * @returns {Object} - Created internship
   */
  static async createInternship(internshipData) {
    try {
      const internship = await Internship.create({
        ...internshipData,
        status: 'active',
        postedDate: new Date()
      });

      return internship;
    } catch (error) {
      throw new Error(`Internship creation failed: ${error.message}`);
    }
  }

  /**
   * Apply for an internship
   * @param {string} userId - User's unique identifier
   * @param {string} internshipId - Internship's unique identifier
   * @param {Object} applicationData - Additional application details
   * @returns {Object} - Internship application
   */
  static async applyForInternship(userId, internshipId, applicationData) {
    try {
      // Check if user has already applied
      const existingApplication = await InternshipApplication.findOne({
        where: { userId, internshipId }
      });

      if (existingApplication) {
        throw new Error('Already applied for this internship');
      }

      // Create application
      const application = await InternshipApplication.create({
        userId,
        internshipId,
        status: 'pending',
        applicationDate: new Date(),
        ...applicationData
      });

      return application;
    } catch (error) {
      throw new Error(`Internship application failed: ${error.message}`);
    }
  }

  /**
   * Update internship application status
   * @param {string} applicationId - Application's unique identifier
   * @param {string} status - New application status
   * @returns {Object} - Updated application
   */
  static async updateApplicationStatus(applicationId, status) {
    try {
      const application = await InternshipApplication.findByPk(applicationId);

      if (!application) {
        throw new Error('Application not found');
      }

      application.status = status;
      application.lastUpdated = new Date();

      await application.save();

      return application;
    } catch (error) {
      throw new Error(`Application status update failed: ${error.message}`);
    }
  }

  /**
   * Get user's internship applications
   * @param {string} userId - User's unique identifier
   * @returns {Array} - List of internship applications
   */
  static async getUserInternshipApplications(userId) {
    try {
      const applications = await InternshipApplication.findAll({
        where: { userId },
        include: [
          { 
            model: Internship,
            attributes: ['title', 'company', 'description']
          }
        ]
      });

      return applications;
    } catch (error) {
      throw new Error(`Fetching internship applications failed: ${error.message}`);
    }
  }

  /**
   * Provide feedback for internship
   * @param {string} applicationId - Application's unique identifier
   * @param {Object} feedbackData - Feedback details
   * @returns {Object} - Updated application with feedback
   */
  static async provideFeedback(applicationId, feedbackData) {
    try {
      const application = await InternshipApplication.findByPk(applicationId);

      if (!application) {
        throw new Error('Application not found');
      }

      application.feedback = feedbackData.feedback;
      application.rating = feedbackData.rating;
      application.lastUpdated = new Date();

      await application.save();

      return application;
    } catch (error) {
      throw new Error(`Feedback submission failed: ${error.message}`);
    }
  }

  /**
   * Search and filter internships
   * @param {Object} filters - Search and filter criteria
   * @returns {Array} - Filtered internship listings
   */
  static async searchInternships(filters) {
    try {
      const { 
        category, 
        location, 
        duration, 
        skillLevel 
      } = filters;

      const whereClause = {};

      if (category) whereClause.category = category;
      if (location) whereClause.location = location;
      if (duration) whereClause.duration = duration;
      if (skillLevel) whereClause.skillLevel = skillLevel;

      const internships = await Internship.findAll({
        where: whereClause,
        order: [['postedDate', 'DESC']],
        limit: filters.limit || 20
      });

      return internships;
    } catch (error) {
      throw new Error(`Internship search failed: ${error.message}`);
    }
  }
}

module.exports = InternshipService;
