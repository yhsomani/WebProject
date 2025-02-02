const logger = require('../config/logger');
const { Internship, User, InternshipApplication } = require('../models');
const { ApiResponse } = require('../utils/responses/apiResponse');
const AppError = require('../utils/errors/AppError');
const { paginateResults } = require('../utils/pagination');
const { Op } = require('sequelize');

class InternshipController {
  static async getAllInternships(req, res, next) {
    try {
      const { page = 1, limit = 10, search, sort, filter } = req.query;
      
      // Build query
      let where = {};
      if (search) {
        where = {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
          ]
        };
      }
      if (filter) {
        const filters = JSON.parse(filter);
        where = { ...where, ...filters };
      }

      // Execute query with pagination
      const { results, total } = await paginateResults(Internship, where, {
        page,
        limit,
        sort,
        include: [
          {
            model: User,
            as: 'employer',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      res.status(200).json(
        ApiResponse.paginated('Internships retrieved successfully', results, page, limit, total)
      );
    } catch (error) {
      next(error);
    }
  }

  static async getInternshipById(req, res, next) {
    try {
      const internship = await Internship.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'employer',
            attributes: ['id', 'name', 'email']
          },
          {
            model: InternshipApplication,
            include: [
              {
                model: User,
                as: 'applicant',
                attributes: ['id', 'name', 'email']
              }
            ]
          }
        ]
      });
      
      if (!internship) {
        throw new AppError('Internship not found', 404);
      }

      res.status(200).json(
        ApiResponse.success('Internship retrieved successfully', internship)
      );
    } catch (error) {
      next(error);
    }
  }

  static async createInternship(req, res, next) {
    try {
      const internship = await Internship.create({
        ...req.body,
        employerId: req.user.id
      });

      // Fetch the created internship with employer details
      const createdInternship = await Internship.findByPk(internship.id, {
        include: [
          {
            model: User,
            as: 'employer',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      res.status(201).json(
        ApiResponse.success('Internship created successfully', createdInternship)
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateInternship(req, res, next) {
    try {
      const internship = await Internship.findByPk(req.params.id);
      
      if (!internship) {
        throw new AppError('Internship not found', 404);
      }

      // Check if user is the employer
      if (internship.employerId !== req.user.id) {
        throw new AppError('Not authorized to update this internship', 403);
      }

      // Update internship
      await internship.update(req.body);
      
      // Fetch updated internship with employer details
      const updatedInternship = await Internship.findByPk(internship.id, {
        include: [
          {
            model: User,
            as: 'employer',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      res.status(200).json(
        ApiResponse.success('Internship updated successfully', updatedInternship)
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteInternship(req, res, next) {
    try {
      const internship = await Internship.findByPk(req.params.id);
      
      if (!internship) {
        throw new AppError('Internship not found', 404);
      }

      // Check if user is the employer
      if (internship.employerId !== req.user.id) {
        throw new AppError('Not authorized to delete this internship', 403);
      }

      await internship.destroy();

      res.status(200).json(
        ApiResponse.success('Internship deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async applyForInternship(req, res, next) {
    try {
      const internship = await Internship.findByPk(req.params.id);
      
      if (!internship) {
        throw new AppError('Internship not found', 404);
      }

      // Check if user has already applied
      const existingApplication = await InternshipApplication.findOne({
        where: {
          internshipId: internship.id,
          userId: req.user.id
        }
      });

      if (existingApplication) {
        throw new AppError('You have already applied for this internship', 400);
      }

      // Create application
      const application = await InternshipApplication.create({
        internshipId: internship.id,
        userId: req.user.id,
        ...req.body
      });

      // Fetch created application with details
      const createdApplication = await InternshipApplication.findByPk(application.id, {
        include: [
          {
            model: Internship,
            include: [
              {
                model: User,
                as: 'employer',
                attributes: ['id', 'name', 'email']
              }
            ]
          },
          {
            model: User,
            as: 'applicant',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      res.status(201).json(
        ApiResponse.success('Application submitted successfully', createdApplication)
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InternshipController;
