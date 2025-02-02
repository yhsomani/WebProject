const mongoose = require('mongoose');
const LearningPath = require('../models/mongodb/LearningPath');
const UserProgress = require('../models/mongodb/UserProgress');
const Analytics = require('../models/mongodb/Analytics');

async function seedMongoDB() {
    try {
        // Clear existing data
        await Promise.all([
            LearningPath.deleteMany({}),
            UserProgress.deleteMany({}),
            Analytics.deleteMany({})
        ]);

        // Seed Learning Paths
        const learningPaths = await LearningPath.create([
            {
                title: "Web Development Fundamentals",
                description: "Master the basics of web development",
                difficulty: "beginner",
                topics: ["HTML", "CSS", "JavaScript"],
                estimatedHours: 40,
                skillsGained: ["HTML5", "CSS3", "Basic JavaScript"]
            },
            {
                title: "Advanced JavaScript",
                description: "Deep dive into advanced JavaScript concepts",
                difficulty: "advanced",
                topics: ["ES6+", "Async Programming", "Design Patterns"],
                estimatedHours: 60,
                skillsGained: ["Promises", "Async/Await", "Modern JS Features"]
            }
        ]);

        console.log('MongoDB seeding completed successfully');
        return { success: true, learningPaths };
    } catch (error) {
        console.error('Error seeding MongoDB:', error);
        throw error;
    }
}

// Run seeding if this script is run directly
if (require.main === module) {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning_platform')
        .then(() => seedMongoDB())
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = seedMongoDB;
