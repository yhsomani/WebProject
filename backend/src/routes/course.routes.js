const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../utils/validation/validator');

// Import models
const { Course, User, CourseProgress } = require('../models');

// Apply protection to all routes
router.use(protect);

// Public routes
router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      where: { status: 'published' },
      include: [{
        model: User,
        as: 'instructor',
        attributes: ['id', 'name']
      }]
    });
    res.json({
      status: 'success',
      data: courses
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: {
        id: req.params.id,
        status: 'published'
      },
      include: [{
        model: User,
        as: 'instructor',
        attributes: ['id', 'name']
      }]
    });

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    res.json({
      status: 'success',
      data: course
    });
  } catch (error) {
    next(error);
  }
});

// Instructor routes
router.use(authorize('instructor'));

router.post('/', validate({
  title: schemas.courseTitle,
  description: schemas.courseDescription,
  category: schemas.courseCategory,
  level: schemas.courseLevel,
  duration: schemas.courseDuration,
  price: schemas.coursePrice
}), async (req, res, next) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructorId: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: course
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validate({
  title: schemas.courseTitle.optional(),
  description: schemas.courseDescription.optional(),
  category: schemas.courseCategory.optional(),
  level: schemas.courseLevel.optional(),
  duration: schemas.courseDuration.optional(),
  price: schemas.coursePrice.optional(),
  status: schemas.courseStatus.optional()
}), async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: {
        id: req.params.id,
        instructorId: req.user.id
      }
    });

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    await course.update(req.body);

    res.json({
      status: 'success',
      data: course
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: {
        id: req.params.id,
        instructorId: req.user.id
      }
    });

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    await course.destroy();

    res.json({
      status: 'success',
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Student routes
router.use(authorize('student'));

router.post('/:id/enroll', async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: {
        id: req.params.id,
        status: 'published'
      }
    });

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    const [progress, created] = await CourseProgress.findOrCreate({
      where: {
        userId: req.user.id,
        courseId: course.id
      },
      defaults: {
        status: 'enrolled',
        progress: 0
      }
    });

    if (!created) {
      return res.status(400).json({
        status: 'error',
        message: 'Already enrolled in this course'
      });
    }

    res.status(201).json({
      status: 'success',
      data: progress
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/progress', validate({
  progress: schemas.courseProgress
}), async (req, res, next) => {
  try {
    const progress = await CourseProgress.findOne({
      where: {
        userId: req.user.id,
        courseId: req.params.id
      }
    });

    if (!progress) {
      return res.status(404).json({
        status: 'error',
        message: 'Not enrolled in this course'
      });
    }

    await progress.update({
      progress: req.body.progress,
      status: req.body.progress >= 100 ? 'completed' : 'in-progress'
    });

    res.json({
      status: 'success',
      data: progress
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
