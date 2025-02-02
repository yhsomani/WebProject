const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

async function seedPostgreSQL() {
    try {
        const queryInterface = sequelize.getQueryInterface();

        // Seed Users
        const hashedPassword = await bcrypt.hash('password123', 10);
        await queryInterface.bulkInsert('users', [
            {
                username: 'john_instructor',
                email: 'john@example.com',
                password_hash: hashedPassword,
                first_name: 'John',
                last_name: 'Doe',
                role: 'instructor',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                username: 'jane_student',
                email: 'jane@example.com',
                password_hash: hashedPassword,
                first_name: 'Jane',
                last_name: 'Smith',
                role: 'student',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // Seed Courses
        await queryInterface.bulkInsert('courses', [
            {
                title: 'Introduction to Web Development',
                description: 'Learn the basics of web development',
                difficulty_level: 'beginner',
                duration_hours: 30,
                instructor_id: 1,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Advanced JavaScript Programming',
                description: 'Master advanced JavaScript concepts',
                difficulty_level: 'advanced',
                duration_hours: 45,
                instructor_id: 1,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // Seed Assessments
        await queryInterface.bulkInsert('assessments', [
            {
                course_id: 1,
                title: 'HTML & CSS Basics Quiz',
                description: 'Test your knowledge of HTML and CSS fundamentals',
                type: 'quiz',
                total_points: 100,
                passing_score: 70,
                duration_minutes: 45,
                created_at: new Date()
            },
            {
                course_id: 2,
                title: 'JavaScript Final Project',
                description: 'Build a complete web application using JavaScript',
                type: 'project',
                total_points: 100,
                passing_score: 75,
                duration_minutes: 180,
                created_at: new Date()
            }
        ]);

        console.log('PostgreSQL seeding completed successfully');
        return { success: true };
    } catch (error) {
        console.error('Error seeding PostgreSQL:', error);
        throw error;
    }
}

// Run seeding if this script is run directly
if (require.main === module) {
    seedPostgreSQL()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = seedPostgreSQL;
