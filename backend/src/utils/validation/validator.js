const Joi = require('joi');

const schemas = {
  // Course schemas
  courseTitle: Joi.string().min(5).max(100).trim(),
  courseDescription: Joi.string().min(20).max(1000).trim(),
  courseCategory: Joi.string().min(2).max(50).trim(),
  courseLevel: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  courseDuration: Joi.number().integer().min(1),
  coursePrice: Joi.number().min(0),
  courseStatus: Joi.string().valid('draft', 'published', 'archived'),
  courseProgress: Joi.number().min(0).max(100),

  // User schemas
  userName: Joi.string().min(2).max(50).trim(),
  userEmail: Joi.string().email(),
  userPassword: Joi.string().min(6),
  userRole: Joi.string().valid('student', 'instructor', 'admin'),
  userPhone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
  userBio: Joi.string(),
  userStatus: Joi.string().valid('active', 'inactive', 'suspended'),

  // Auth schemas
  resetToken: Joi.string().hex().length(64),
  currentPassword: Joi.string().min(6),
  newPassword: Joi.string().min(6),

  // Internship schemas
  internshipTitle: Joi.string().min(5).max(100).trim(),
  internshipDescription: Joi.string().min(20).max(2000).trim(),
  internshipCompany: Joi.string().min(2).max(100).trim(),
  internshipLocation: Joi.string().required(),
  internshipType: Joi.string().valid('remote', 'onsite', 'hybrid'),
  internshipDuration: Joi.number().integer().min(1),
  internshipStipend: Joi.number().min(0),
  internshipStatus: Joi.string().valid('draft', 'open', 'closed', 'archived'),
  internshipSkills: Joi.array().items(Joi.string()),
  internshipRequirements: Joi.array().items(Joi.string()),
  internshipDeadline: Joi.date(),
  internshipStartDate: Joi.date(),
  internshipPositions: Joi.number().integer().min(1),

  // Application schemas
  applicationStatus: Joi.string().valid('pending', 'under_review', 'accepted', 'rejected', 'withdrawn'),
  applicationCoverLetter: Joi.string().min(100).max(2000),
  applicationResume: Joi.string().required(),
  applicationPortfolio: Joi.string(),
  applicationExperience: Joi.array().items(Joi.object()),
  applicationSkills: Joi.array().items(Joi.string()),
  applicationFeedback: Joi.string()
};

const validate = (schema) => {
  return (req, res, next) => {
    const validationSchema = {};
    Object.keys(schema).forEach(key => {
      if (schema[key]) {
        validationSchema[key] = schema[key];
      }
    });

    const validationResult = Joi.object(validationSchema).validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: false
    });

    if (validationResult.error) {
      const errorMessage = validationResult.error.details
        .map(detail => detail.message)
        .join(', ');
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errorMessage
      });
    }

    next();
  };
};

module.exports = {
  schemas,
  validate
};
