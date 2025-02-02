const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../utils/validation/validator');

// Apply protection to all routes
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validate({
  name: schemas.userName,
  email: schemas.userEmail,
  phone: schemas.userPhone,
  bio: schemas.userBio
}), userController.updateProfile);

// Course routes
router.get('/courses', userController.getEnrolledCourses);
router.get('/courses/:courseId/progress', userController.getCourseProgress);

// Internship application routes
router.get('/applications', userController.getInternshipApplications);

// Admin routes
router.use(authorize('admin'));
router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.put('/:userId', validate({
  name: schemas.userName,
  email: schemas.userEmail,
  phone: schemas.userPhone,
  bio: schemas.userBio,
  role: schemas.userRole
}), userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;
