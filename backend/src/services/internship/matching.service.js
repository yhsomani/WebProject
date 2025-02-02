const Internship = require('../models/Internship');
const UserSkill = require('../models/UserSkill');
const UserProfile = require('../models/UserProfile');

class InternshipMatchingService {
  // Advanced internship matching algorithm
  static async findMatchingInternships(userId, options = {}) {
    try {
      // Fetch user's skills and profile
      const userSkills = await UserSkill.findAll({ 
        where: { userId },
        attributes: ['skillName', 'proficiencyLevel']
      });

      const userProfile = await UserProfile.findOne({ 
        where: { userId },
        include: ['education', 'certifications']
      });

      // Define matching weights
      const weights = {
        skillMatch: 0.4,
        educationMatch: 0.3,
        locationPreference: 0.2,
        compensationMatch: 0.1
      };

      // Fetch potential internships
      const potentialInternships = await Internship.findAll({
        where: {
          status: 'active',
          applicationDeadline: { 
            [Op.gt]: new Date() 
          }
        },
        order: [['createdAt', 'DESC']],
        limit: options.limit || 10
      });

      // Score and rank internships
      const scoredInternships = potentialInternships.map(internship => {
        let score = 0;

        // Skill match score
        const skillMatchScore = this.calculateSkillMatchScore(
          userSkills, 
          internship.requiredSkills
        );
        score += skillMatchScore * weights.skillMatch;

        // Education match score
        const educationScore = this.calculateEducationScore(
          userProfile.education, 
          internship.preferredEducation
        );
        score += educationScore * weights.educationMatch;

        // Location preference score
        const locationScore = this.calculateLocationScore(
          userProfile.preferredLocation, 
          internship.location
        );
        score += locationScore * weights.locationPreference;

        // Compensation match score
        const compensationScore = this.calculateCompensationScore(
          userProfile.expectedCompensation, 
          internship.compensation
        );
        score += compensationScore * weights.compensationMatch;

        return { internship, score };
      });

      // Sort by matching score
      return scoredInternships
        .sort((a, b) => b.score - a.score)
        .slice(0, options.limit || 5)
        .map(item => item.internship);

    } catch (error) {
      logger.error('Internship Matching Error', { 
        userId, 
        error: error.message 
      });
      throw error;
    }
  }

  // Calculate skill match percentage
  static calculateSkillMatchScore(userSkills, internshipSkills) {
    const matchedSkills = userSkills.filter(us => 
      internshipSkills.includes(us.skillName) && 
      us.proficiencyLevel >= 'intermediate'
    );

    return matchedSkills.length / internshipSkills.length;
  }

  // Calculate education match score
  static calculateEducationScore(userEducation, preferredEducation) {
    const educationHierarchy = [
      'high_school', 
      'associate_degree', 
      'bachelor_degree', 
      'master_degree', 
      'phd'
    ];

    const userEducationLevel = educationHierarchy.indexOf(userEducation.level);
    const preferredEducationLevel = educationHierarchy.indexOf(preferredEducation);

    return userEducationLevel >= preferredEducationLevel ? 1 : 0;
  }

  // Calculate location preference score
  static calculateLocationScore(userLocation, internshipLocation) {
    // Implement advanced location matching logic
    // Could include distance calculation, remote work preference, etc.
    return userLocation === internshipLocation ? 1 : 0.5;
  }

  // Calculate compensation match score
  static calculateCompensationScore(userExpectation, internshipCompensation) {
    const toleranceRange = 0.2; // 20% tolerance
    
    return Math.max(
      0, 
      1 - Math.abs(userExpectation - internshipCompensation) / userExpectation
    );
  }

  // Generate personalized internship recommendations
  static async generateInternshipRecommendations(userId) {
    const matchedInternships = await this.findMatchingInternships(userId, { limit: 10 });
    
    return matchedInternships.map((internship, index) => ({
      rank: index + 1,
      internship: internship,
      recommendationReason: this.generateRecommendationReason(internship)
    }));
  }

  // Generate natural language recommendation reason
  static generateRecommendationReason(internship) {
    const reasons = [
      `Matches your ${internship.requiredSkills[0]} skill set`,
      `Great opportunity in ${internship.company} for your career growth`,
      `Aligns with your professional interests in ${internship.category}`
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  }
}

module.exports = InternshipMatchingService;
