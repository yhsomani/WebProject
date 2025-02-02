const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  learningPathId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath', required: true },
  progress: {
    completedCourses: [{
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      completedAt: { type: Date },
      score: { type: Number },
      timeSpent: { type: Number } // in minutes
    }],
    currentCourse: {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      progress: { type: Number, default: 0 }, // percentage
      lastAccessed: { type: Date }
    }
  },
  startDate: { type: Date, default: Date.now },
  lastActivityDate: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  completionDate: { type: Date }
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);
module.exports = UserProgress;
