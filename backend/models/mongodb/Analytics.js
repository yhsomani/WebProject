const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['course_view', 'assessment_completion', 'learning_time', 'achievement'], required: true },
  data: {
    itemId: { type: mongoose.Schema.Types.ObjectId }, // Course/Assessment ID
    timeSpent: { type: Number }, // in minutes
    score: { type: Number },
    achievement: { type: String },
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed }
  },
  timestamp: { type: Date, default: Date.now },
  deviceInfo: {
    platform: String,
    browser: String,
    device: String
  }
});

// Index for efficient querying
analyticsSchema.index({ userId: 1, type: 1, timestamp: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
