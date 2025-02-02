const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  topics: [{ type: String }],
  courses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    order: { type: Number },
    required: { type: Boolean, default: true }
  }],
  estimatedHours: { type: Number },
  skillsGained: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const LearningPath = mongoose.model('LearningPath', learningPathSchema);
module.exports = LearningPath;
