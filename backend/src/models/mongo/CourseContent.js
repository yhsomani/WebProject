const mongoose = require('mongoose');

const courseContentSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    ref: 'Course'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'text', 'quiz', 'assignment'],
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CourseContent', courseContentSchema);
