const { Op } = require('sequelize');

class ApplicationService {
  constructor(models) {
    this.models = models;
  }

  async submitInternshipApplication(internshipId, userId) {
    try {
      // Check if user has already applied
      const existingApplication = await this.models.InternshipApplication.findOne({
        where: { 
          internshipId, 
          userId 
        }
      });

      if (existingApplication) {
        return {
          success: false,
          message: 'You have already applied for this internship'
        };
      }

      // Validate internship status and deadline
      const internship = await this.models.Internship.findByPk(internshipId);
      
      if (!internship || internship.status !== 'active') {
        return {
          success: false,
          message: 'Internship is not currently accepting applications'
        };
      }

      if (new Date(internship.applicationDeadline) < new Date()) {
        return {
          success: false,
          message: 'Application deadline has passed'
        };
      }

      // Create application
      const application = await this.models.InternshipApplication.create({
        internshipId,
        userId,
        status: 'pending',
        applicationDate: new Date()
      });

      return {
        success: true,
        application,
        message: 'Application submitted successfully'
      };
    } catch (error) {
      console.error('Internship application error:', error);
      return {
        success: false,
        message: 'Error submitting application'
      };
    }
  }

  async getApplicationStatus(userId, internshipId) {
    try {
      const application = await this.models.InternshipApplication.findOne({
        where: { 
          userId, 
          internshipId 
        },
        include: [
          { 
            model: this.models.Internship,
            attributes: ['title', 'company']
          }
        ]
      });

      return application || null;
    } catch (error) {
      console.error('Application status retrieval error:', error);
      return null;
    }
  }

  async getUserApplications(userId) {
    try {
      const applications = await this.models.InternshipApplication.findAll({
        where: { userId },
        include: [
          { 
            model: this.models.Internship,
            attributes: ['title', 'company', 'status']
          }
        ],
        order: [['applicationDate', 'DESC']]
      });

      return applications;
    } catch (error) {
      console.error('User applications retrieval error:', error);
      return [];
    }
  }

  async updateApplicationStatus(applicationId, newStatus) {
    try {
      const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
      
      if (!validStatuses.includes(newStatus)) {
        return {
          success: false,
          message: 'Invalid application status'
        };
      }

      const application = await this.models.InternshipApplication.findByPk(applicationId);
      
      if (!application) {
        return {
          success: false,
          message: 'Application not found'
        };
      }

      await application.update({ status: newStatus });

      return {
        success: true,
        application,
        message: 'Application status updated successfully'
      };
    } catch (error) {
      console.error('Application status update error:', error);
      return {
        success: false,
        message: 'Error updating application status'
      };
    }
  }
}

module.exports = (models) => new ApplicationService(models);
