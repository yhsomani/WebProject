const { sequelize, mongoose } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');
const seedMongoDB = require('./seedMongoDB');
const seedPostgreSQL = require('./seedPostgreSQL');

async function runPostgreSQLMigrations() {
    try {
        const migrationFile = path.join(__dirname, '../database/migrations/001_initial_schema.sql');
        const sql = await fs.readFile(migrationFile, 'utf8');
        await sequelize.query(sql);
        console.log('PostgreSQL migrations completed successfully');
    } catch (error) {
        console.error('Error running PostgreSQL migrations:', error);
        throw error;
    }
}

async function initializeDatabase() {
    try {
        // Run PostgreSQL migrations
        await runPostgreSQLMigrations();
        
        // Seed both databases
        await Promise.all([
            seedPostgreSQL(),
            seedMongoDB()
        ]);

        console.log('Database initialization completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing databases:', error);
        process.exit(1);
    }
}

// Run initialization if this script is run directly
if (require.main === module) {
    initializeDatabase();
}
