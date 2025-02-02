const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../utils/validation/validator');

// Apply auth middleware to all routes
router.use(protect);

// Get all internships (public)
router.get('/', async (req, res, next) => {
  try {
    const { Internship, User } = require('../models');
    const internships = await Internship.findAll({
      where: { status: 'published' },
      include: [{
        model: User,
        as: 'employer',
        attributes: ['id', 'name']
      }]
    });
    res.json({ success: true, data: internships });
  } catch (error) {
    next(error);
  }
});

// Get internship by ID (public)
router.get('/:internshipId', async (req, res, next) => {
  try {
    const { Internship, User } = require('../models');
    const internship = await Internship.findOne({
      where: {
        id: req.params.internshipId,
        status: 'published'
      },
      include: [{
        model: User,
        as: 'employer',
        attributes: ['id', 'name']
      }]
    });
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({ success: true, data: internship });
  } catch (error) {
    next(error);
  }
});

// Employer routes
router.use(authorize('instructor', 'admin'));

// Create internship
router.post('/', validate({
  title: schemas.internshipTitle.required(),
  description: schemas.internshipDescription.required(),
  company: schemas.internshipCompany.required(),
  location: schemas.internshipLocation.required(),
  type: schemas.internshipType.required(),
  duration: schemas.internshipDuration.required(),
  stipend: schemas.internshipStipend.required()
}), async (req, res, next) => {
  try {
    const { Internship } = require('../models');
    const internship = await Internship.create({
      ...req.body,
      employerId: req.user.id
    });
    res.status(201).json({ success: true, data: internship });
  } catch (error) {
    next(error);
  }
});

// Update internship
router.put('/:internshipId', validate({
  title: schemas.internshipTitle.optional(),
  description: schemas.internshipDescription.optional(),
  company: schemas.internshipCompany.optional(),
  location: schemas.internshipLocation.optional(),
  type: schemas.internshipType.optional(),
  duration: schemas.internshipDuration.optional(),
  stipend: schemas.internshipStipend.optional()
}), async (req, res, next) => {
  try {
    const { Internship } = require('../models');
    const internship = await Internship.findOne({
      where: {
        id: req.params.internshipId,
        employerId: req.user.id
      }
    });
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    await internship.update(req.body);
    res.json({ success: true, data: internship });
  } catch (error) {
    next(error);
  }
});

// Delete internship
router.delete('/:internshipId', async (req, res, next) => {
  try {
    const { Internship } = require('../models');
    const internship = await Internship.findOne({
      where: {
        id: req.params.internshipId,
        employerId: req.user.id
      }
    });
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    await internship.destroy();
    res.json({ success: true, message: 'Internship deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Student routes
router.use(authorize('student'));

// Apply for internship
router.post('/:internshipId/apply', async (req, res, next) => {
  try {
    const { Internship, InternshipApplication } = require('../models');
    const internship = await Internship.findOne({
      where: {
        id: req.params.internshipId,
        status: 'published'
      }
    });
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    // Check if user has already applied
    const existingApplication = await InternshipApplication.findOne({
      where: {
        internshipId: req.params.internshipId,
        userId: req.user.id
      }
    });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this internship' });
    }

    const application = await InternshipApplication.create({
      internshipId: req.params.internshipId,
      userId: req.user.id,
      status: 'pending',
      ...req.body
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

// Withdraw application
router.delete('/:internshipId/withdraw', async (req, res, next) => {
  try {
    const { InternshipApplication } = require('../models');
    const application = await InternshipApplication.findOne({
      where: {
        internshipId: req.params.internshipId,
        userId: req.user.id,
        status: 'pending'
      }
    });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    await application.destroy();
    res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
