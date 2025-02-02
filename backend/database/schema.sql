-- Users Table with Comprehensive Profile Management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    profile_picture_url TEXT,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    address JSONB,
    skills TEXT[],
    interests TEXT[],
    education_level VARCHAR(50),
    preferred_learning_style VARCHAR(50),
    account_status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE
);

-- Courses Table with Advanced Metadata
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES users(id),
    category VARCHAR(100),
    sub_category VARCHAR(100),
    skill_level VARCHAR(50) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    duration_hours NUMERIC(5,2),
    price DECIMAL(10,2),
    total_modules INTEGER,
    certification_available BOOLEAN DEFAULT FALSE,
    prerequisites TEXT[],
    learning_outcomes TEXT[],
    tags TEXT[],
    difficulty_rating NUMERIC(3,2),
    average_rating NUMERIC(3,2),
    total_enrollments INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Internships Table with Dynamic Listings
CREATE TABLE internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    duration_weeks INTEGER,
    stipend DECIMAL(10,2),
    skills_required TEXT[],
    responsibilities TEXT[],
    application_deadline DATE,
    status VARCHAR(50) DEFAULT 'active',
    total_positions INTEGER,
    application_process TEXT,
    industry VARCHAR(100),
    experience_level VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Course Enrollment Tracking
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress_percentage NUMERIC(5,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'in_progress',
    completed_at TIMESTAMP,
    certificate_issued BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMP
);

-- Internship Applications
CREATE TABLE internship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    internship_id UUID REFERENCES internships(id),
    application_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'submitted',
    resume_url TEXT,
    cover_letter TEXT,
    interview_stages JSONB,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Skills Tracking
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),
    years_of_experience NUMERIC(4,1),
    last_used DATE,
    verification_status VARCHAR(50) DEFAULT 'self_reported',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance Optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_internships_skills ON internships USING GIN(skills_required);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
