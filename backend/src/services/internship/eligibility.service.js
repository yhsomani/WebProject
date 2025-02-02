const natural = require('natural');
const { TfIdf } = natural;

class EligibilityService {
  constructor(models) {
    this.models = models;
    this.tfidf = new TfIdf();
  }

  async checkInternshipEligibility(internship, userId) {
    try {
      const user = await this.models.User.findByPk(userId);
      
      if (!user) {
        return { 
          eligible: false, 
          reason: 'User not found' 
        };
      }

      // Check skill compatibility
      const skillMatchScore = this.calculateSkillMatchScore(
        internship.skillsRequired, 
        user.skills
      );

      // Additional eligibility criteria
      const eligibilityCriteria = [
        {
          check: () => skillMatchScore >= 0.6,
          failureReason: 'Insufficient skill match'
        },
        {
          check: () => internship.status === 'active',
          failureReason: 'Internship is not currently active'
        },
        {
          check: () => new Date(internship.applicationDeadline) > new Date(),
          failureReason: 'Application deadline has passed'
        }
      ];

      const failedCriteria = eligibilityCriteria.filter(
        criteria => !criteria.check()
      );

      return {
        eligible: failedCriteria.length === 0,
        skillMatchScore,
        reasons: failedCriteria.map(criteria => criteria.failureReason)
      };
    } catch (error) {
      console.error('Eligibility check error:', error);
      return { 
        eligible: false, 
        reason: 'Internal error during eligibility check' 
      };
    }
  }

  calculateSkillMatchScore(requiredSkills, userSkills) {
    // Prepare TF-IDF vectors
    requiredSkills.forEach(skill => this.tfidf.addDocument(skill));
    userSkills.forEach(skill => this.tfidf.addDocument(skill));

    // Calculate cosine similarity
    const requiredVector = requiredSkills.map(skill => 
      this.tfidf.tfidf(skill, 0)
    );
    const userVector = userSkills.map(skill => 
      this.tfidf.tfidf(skill, 1)
    );

    return this.cosineSimilarity(requiredVector, userVector);
  }

  cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitude1 * magnitude2 || 1);
  }

  async recommendInternships(userId) {
    try {
      const user = await this.models.User.findByPk(userId);
      
      const allInternships = await this.models.Internship.findAll({
        where: { status: 'active' }
      });

      // Rank internships based on skill match
      const rankedInternships = allInternships
        .map(internship => ({
          internship,
          matchScore: this.calculateSkillMatchScore(
            internship.skillsRequired, 
            user.skills
          )
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);  // Top 5 recommendations

      return rankedInternships.map(item => ({
        ...item.internship.toJSON(),
        matchScore: item.matchScore
      }));
    } catch (error) {
      console.error('Internship recommendation error:', error);
      return [];
    }
  }
}

module.exports = (models) => new EligibilityService(models);
