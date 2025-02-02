const { Course, UserSkill, UserCourseProgress } = require('../models');
const { Op } = require('sequelize');
const natural = require('natural');
const tf = require('@tensorflow/tfjs-node');

class CourseRecommendationService {
  constructor() {
    this.tfidf = new natural.TfIdf();
  }

  // Multi-dimensional course recommendation
  async recommendCourses(userId, options = {}) {
    const { 
      limit = 10, 
      includeCompleted = false 
    } = options;

    // Fetch user's skills and learning history
    const userSkills = await UserSkill.findAll({ 
      where: { userId },
      attributes: ['skillName', 'proficiencyLevel']
    });

    const completedCourses = await UserCourseProgress.findAll({
      where: { 
        userId, 
        status: 'completed' 
      },
      include: [{ model: Course }]
    });

    // Recommendation strategies
    const skillBasedRecommendations = await this.recommendBySkills(
      userSkills, 
      completedCourses
    );

    const contentBasedRecommendations = await this.recommendByContent(
      completedCourses
    );

    const collaborativeFilteringRecommendations = await this.recommendByCollaborativeFiltering(
      userId
    );

    // Combine and rank recommendations
    const combinedRecommendations = this.rankRecommendations([
      ...skillBasedRecommendations,
      ...contentBasedRecommendations,
      ...collaborativeFilteringRecommendations
    ]);

    // Filter out already completed courses if needed
    const filteredRecommendations = includeCompleted 
      ? combinedRecommendations 
      : combinedRecommendations.filter(
          course => !completedCourses.some(cc => cc.courseId === course.id)
        );

    return filteredRecommendations.slice(0, limit);
  }

  // Skill-based recommendation
  async recommendBySkills(userSkills, completedCourses) {
    const skillNames = userSkills.map(skill => skill.skillName);

    const recommendations = await Course.findAll({
      where: {
        requiredSkills: {
          [Op.overlap]: skillNames
        },
        skillLevel: {
          [Op.in]: this.determineAppropriateSkillLevels(userSkills)
        }
      },
      order: [['rating', 'DESC']],
      limit: 20
    });

    return recommendations.map(course => ({
      ...course.dataValues,
      recommendationReason: `Matches your ${skillNames.join(', ')} skills`
    }));
  }

  // Content-based recommendation using TF-IDF
  async recommendByContent(completedCourses) {
    // Create TF-IDF vectors for completed courses
    completedCourses.forEach(course => {
      this.tfidf.addDocument(course.Course.description);
    });

    const courseDescriptions = await Course.findAll({
      attributes: ['id', 'description']
    });

    const recommendations = courseDescriptions.map(course => {
      const courseVector = this.computeTFIDFVector(course.description);
      const similarity = this.computeCosineSimilarity(
        completedCourses[0].Course.description, 
        course.description
      );

      return {
        ...course.dataValues,
        similarity,
        recommendationReason: 'Content similarity'
      };
    }).sort((a, b) => b.similarity - a.similarity);

    return recommendations.slice(0, 10);
  }

  // Collaborative filtering using machine learning
  async recommendByCollaborativeFiltering(userId) {
    // Implement collaborative filtering
    // Use TensorFlow for matrix factorization
    const model = this.createCollaborativeFilteringModel();
    
    const userInteractionMatrix = await this.createUserInteractionMatrix();
    
    const recommendations = await model.predict(userInteractionMatrix);

    return recommendations.map(rec => ({
      ...rec,
      recommendationReason: 'User behavior similarity'
    }));
  }

  // Rank recommendations based on multiple factors
  rankRecommendations(recommendations) {
    return recommendations
      .sort((a, b) => {
        // Multi-factor ranking
        const scoreA = this.computeRecommendationScore(a);
        const scoreB = this.computeRecommendationScore(b);
        return scoreB - scoreA;
      });
  }

  // Compute recommendation score
  computeRecommendationScore(course) {
    return (
      (course.rating || 0) * 0.4 +
      (course.similarity || 0) * 0.3 +
      (course.enrollmentCount || 0) * 0.2 +
      (Math.random() * 0.1)  // Add some randomness
    );
  }

  // Determine appropriate skill levels
  determineAppropriateSkillLevels(userSkills) {
    const highestSkillLevel = userSkills.reduce(
      (max, skill) => this.mapSkillLevel(skill.proficiencyLevel) > max 
        ? this.mapSkillLevel(skill.proficiencyLevel) 
        : max, 
      0
    );

    return ['beginner', 'intermediate', 'advanced']
      .filter((_, index) => index <= highestSkillLevel);
  }

  // Map skill level to numeric value
  mapSkillLevel(level) {
    const levelMap = {
      'beginner': 0,
      'intermediate': 1,
      'advanced': 2
    };
    return levelMap[level] || 0;
  }

  // Compute TF-IDF vector
  computeTFIDFVector(document) {
    const vector = [];
    this.tfidf.tfidfs(document, (i, measure) => {
      vector.push(measure);
    });
    return vector;
  }

  // Compute cosine similarity
  computeCosineSimilarity(doc1, doc2) {
    const vec1 = this.computeTFIDFVector(doc1);
    const vec2 = this.computeTFIDFVector(doc2);

    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitude1 * magnitude2);
  }

  // Create collaborative filtering model
  createCollaborativeFilteringModel() {
    // TensorFlow matrix factorization model
    const model = tf.sequential();
    // Add layers for collaborative filtering
    return model;
  }

  // Create user interaction matrix
  async createUserInteractionMatrix() {
    // Fetch user course interactions
    // Create matrix for collaborative filtering
    return [];
  }
}

module.exports = new CourseRecommendationService();
