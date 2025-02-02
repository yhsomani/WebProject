const { Op } = require('sequelize');

class ProgressService {
  constructor(models) {
    this.models = models;
  }

  async trackCourseProgress(userId, courseId, moduleData) {
    try {
      const [progress, created] = await this.models.CourseProgress.findOrCreate({
        where: { 
          userId, 
          courseId 
        },
        defaults: {
          completedModules: [],
          totalProgress: 0
        }
      });

      // Update completed modules
      const updatedCompletedModules = [...new Set([
        ...progress.completedModules, 
        ...moduleData.completedModules
      ])];

      // Calculate total progress
      const totalProgress = (updatedCompletedModules.length / moduleData.totalModules) * 100;

      await progress.update({
        completedModules: updatedCompletedModules,
        totalProgress: Math.round(totalProgress)
      });

      return progress;
    } catch (error) {
      console.error('Error tracking course progress:', error);
      throw error;
    }
  }

  async calculateCourseProgress(courseId, userId) {
    try {
      const progress = await this.models.CourseProgress.findOne({
        where: { 
          userId, 
          courseId 
        }
      });

      return progress ? progress.totalProgress : 0;
    } catch (error) {
      console.error('Error calculating course progress:', error);
      return 0;
    }
  }

  async getCompletedCourses(userId) {
    try {
      const completedCourses = await this.models.CourseProgress.findAll({
        where: { 
          userId,
          totalProgress: {
            [Op.gte]: 90  // Courses with 90% or more progress
          }
        },
        include: [this.models.Course]
      });

      return completedCourses.map(progress => progress.Course);
    } catch (error) {
      console.error('Error retrieving completed courses:', error);
      return [];
    }
  }

  async generateLearningInsights(userId) {
    try {
      const totalCoursesEnrolled = await this.models.CourseProgress.count({
        where: { userId }
      });

      const completedCourses = await this.getCompletedCourses(userId);

      const averageProgress = await this.models.CourseProgress.findAll({
        where: { userId }
      }).then(progresses => 
        progresses.reduce((sum, prog) => sum + prog.totalProgress, 0) / progresses.length
      );

      return {
        totalCoursesEnrolled,
        completedCoursesCount: completedCourses.length,
        averageProgress: Math.round(averageProgress),
        completedCourses
      };
    } catch (error) {
      console.error('Error generating learning insights:', error);
      return null;
    }
  }
}

module.exports = (models) => new ProgressService(models);
