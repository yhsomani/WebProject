const UserSkill = require('../models/UserSkill');
const SkillAssessment = require('../models/SkillAssessment');
const MachineLearningModel = require('../ml/SkillPredictionModel');

class SkillAssessmentService {
  // Comprehensive skill assessment
  static async assessUserSkills(userId, assessmentData) {
    try {
      // Validate input data
      this.validateAssessmentData(assessmentData);

      // Perform initial skill assessment
      const initialAssessment = this.calculateInitialSkillScore(assessmentData);

      // Machine learning skill prediction
      const mlPrediction = await this.predictSkillPotential(userId, assessmentData);

      // Combine assessment results
      const combinedSkillProfile = this.combineAssessmentResults(
        initialAssessment, 
        mlPrediction
      );

      // Save skill assessment
      const skillAssessment = await SkillAssessment.create({
        userId,
        assessmentData,
        skillProfile: combinedSkillProfile,
        assessmentDate: new Date()
      });

      // Update user skills
      await this.updateUserSkills(userId, combinedSkillProfile);

      return {
        assessment: skillAssessment,
        recommendations: this.generateSkillDevelopmentRecommendations(combinedSkillProfile)
      };

    } catch (error) {
      logger.error('Skill Assessment Error', { 
        userId, 
        error: error.message 
      });
      throw error;
    }
  }

  // Initial skill score calculation
  static calculateInitialSkillScore(assessmentData) {
    const skillScores = {};

    for (const [skill, responses] of Object.entries(assessmentData)) {
      const totalScore = responses.reduce((sum, response) => sum + response.score, 0);
      const averageScore = totalScore / responses.length;

      skillScores[skill] = {
        averageScore,
        confidence: this.calculateConfidence(responses),
        strengths: this.identifyStrengths(responses),
        weaknesses: this.identifyWeaknesses(responses)
      };
    }

    return skillScores;
  }

  // Machine learning skill potential prediction
  static async predictSkillPotential(userId, assessmentData) {
    try {
      const mlModel = new MachineLearningModel();
      return await mlModel.predictSkillTrajectory(userId, assessmentData);
    } catch (error) {
      logger.warn('ML Skill Prediction Failed', { error: error.message });
      return {};
    }
  }

  // Combine assessment results
  static combineAssessmentResults(initialAssessment, mlPrediction) {
    const combinedSkillProfile = {};

    for (const skill in initialAssessment) {
      combinedSkillProfile[skill] = {
        ...initialAssessment[skill],
        mlPredictedPotential: mlPrediction[skill]?.potential || null,
        recommendedLearningPath: mlPrediction[skill]?.learningPath || []
      };
    }

    return combinedSkillProfile;
  }

  // Update user skills database
  static async updateUserSkills(userId, skillProfile) {
    for (const [skillName, skillData] of Object.entries(skillProfile)) {
      await UserSkill.upsert({
        userId,
        skillName,
        proficiencyLevel: this.mapScoreToProficiencyLevel(skillData.averageScore),
        confidence: skillData.confidence,
        lastAssessedAt: new Date()
      });
    }
  }

  // Generate personalized skill development recommendations
  static generateSkillDevelopmentRecommendations(skillProfile) {
    const recommendations = [];

    for (const [skill, skillData] of Object.entries(skillProfile)) {
      if (skillData.averageScore < 0.6) {
        recommendations.push({
          skill,
          recommendationType: 'improvement',
          reason: `Your ${skill} skill needs development`,
          suggestedResources: this.findLearningResources(skill, skillData)
        });
      }

      if (skillData.mlPredictedPotential && skillData.mlPredictedPotential > 0.8) {
        recommendations.push({
          skill,
          recommendationType: 'advanced_track',
          reason: `High potential detected in ${skill}`,
          suggestedPath: skillData.recommendedLearningPath
        });
      }
    }

    return recommendations;
  }

  // Helper methods for advanced assessment
  static calculateConfidence(responses) {
    const varianceScore = this.calculateResponseVariance(responses);
    return 1 - varianceScore;
  }

  static identifyStrengths(responses) {
    return responses
      .filter(r => r.score > 0.7)
      .map(r => r.category);
  }

  static identifyWeaknesses(responses) {
    return responses
      .filter(r => r.score < 0.4)
      .map(r => r.category);
  }

  static mapScoreToProficiencyLevel(score) {
    if (score < 0.3) return 'beginner';
    if (score < 0.6) return 'intermediate';
    if (score < 0.8) return 'advanced';
    return 'expert';
  }

  static findLearningResources(skill, skillData) {
    // Implement intelligent resource recommendation
    const resources = [
      `Online course for ${skill}`,
      `Tutorial series on ${skill}`,
      `Practice project for ${skill}`
    ];
    return resources;
  }

  static validateAssessmentData(assessmentData) {
    if (!assessmentData || Object.keys(assessmentData).length === 0) {
      throw new Error('Invalid assessment data');
    }
  }
}

module.exports = SkillAssessmentService;
