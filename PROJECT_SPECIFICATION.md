# Learning Platform Project Specification

## 1. Project Overview
A comprehensive learning platform designed to provide students with courses, internships, and skill development opportunities.

## 2. Technology Stack

### Backend
- **Language**: Node.js
- **Framework**: Express.js
- **Database**: 
  - Primary: PostgreSQL
  - Secondary: MongoDB (Optional)
- **ORM**: Sequelize
- **Authentication**: JWT

### Frontend
- **Framework**: React.js
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI
- **Routing**: React Router
- **Form Handling**: Formik/Yup

## 3. Backend Architecture

### 3.1 Authentication Module
#### Functional Requirements
- User Registration
  - Email-based registration
  - Password complexity validation
  - Role-based user creation (student, mentor, admin)

#### Technical Implementation
```javascript
// Authentication Service
class AuthService {
  async register(userData) {
    // 1. Validate input
    // 2. Check email uniqueness
    // 3. Hash password
    // 4. Create user record
    // 5. Generate JWT token
  }

  async login(email, password) {
    // 1. Validate credentials
    // 2. Generate authentication token
    // 3. Return user profile
  }
}
```

### 3.2 Course Management Module
#### Functional Requirements
- Course Enrollment
- Progress Tracking
- Certification Generation
- Course Recommendation

#### Technical Implementation
```javascript
class CourseService {
  async enrollInCourse(userId, courseId) {
    // 1. Validate course availability
    // 2. Check user eligibility
    // 3. Create enrollment record
    // 4. Initialize progress tracking
  }

  async updateCourseProgress(userId, courseId, progressData) {
    // 1. Update progress percentage
    // 2. Check course completion
    // 3. Generate certificate if completed
  }
}
```

### 3.3 Internship Management Module
#### Functional Requirements
- Internship Listing
- Application Submission
- Application Tracking
- Recommendation System

#### Technical Implementation
```javascript
class InternshipService {
  async applyForInternship(userId, internshipId, applicationData) {
    // 1. Validate application eligibility
    // 2. Create application record
    // 3. Notify relevant parties
    // 4. Update application status
  }

  async searchInternships(filters) {
    // 1. Build dynamic search query
    // 2. Apply filters
    // 3. Return matched internships
  }
}
```

## 4. Frontend Architecture

### 4.1 Authentication Components
#### Functional Requirements
- Registration Page
- Login Page
- Password Reset
- Profile Management

#### Technical Implementation
```jsx
function AuthComponent() {
  // 1. Manage authentication state
  // 2. Handle form validations
  // 3. Integrate with backend API
  // 4. Manage JWT token storage
  // 5. Redirect based on authentication status
}
```

### 4.2 Course Management UI
#### Functional Requirements
- Course Catalog
- Course Details
- Enrollment Process
- Progress Tracking
- Certification Display

#### Technical Implementation
```jsx
function CourseDashboard() {
  // 1. Fetch enrolled courses
  // 2. Display progress
  // 3. Show course recommendations
  // 4. Manage course interactions
}
```

### 4.3 Internship Management UI
#### Functional Requirements
- Internship Listings
- Advanced Search
- Application Submission
- Application Tracking
- Recommendation System

#### Technical Implementation
```jsx
function InternshipComponent() {
  // 1. Fetch internship listings
  // 2. Apply filters
  // 3. Manage application workflow
  // 4. Display application status
}
```

## 5. Database Design

### 5.1 User Model
- Unique Identifier
- Authentication Details
- Profile Information
- Role Management

### 5.2 Course Model
- Course Metadata
- Enrollment Tracking
- Progress Monitoring

### 5.3 Internship Model
- Listing Details
- Application Tracking
- Status Management

## 6. Security Considerations
- Password Hashing
- JWT Token Security
- Input Validation
- Role-Based Access Control
- HTTPS Communication

## 7. Performance Optimization
- Database Indexing
- Caching Mechanisms
- Efficient Query Design
- Code Splitting
- Lazy Loading

## 8. Deployment Strategy
- Docker Containerization
- CI/CD Pipeline
- Environment-Specific Configurations
- Scalable Cloud Deployment

## 9. Testing Approach
- Unit Testing
- Integration Testing
- End-to-End Testing
- Performance Testing

## 10. Future Enhancements
- AI-Powered Recommendations
- Advanced Gamification
- Multi-language Support
- Machine Learning Integration

## Appendix: Project Structure
```
learning-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── redux/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
└── PROJECT_SPECIFICATION.md
```


# Learning Platform Project Documentation

## 1. Project Overview
A comprehensive learning platform for students to access courses, internships, and skill development opportunities.

## 2. Technology Stack

### Backend Technologies
- **Language**: Node.js
- **Framework**: Express.js
- **Database**: 
  - Primary: PostgreSQL
  - Secondary: MongoDB (Optional)
- **ORM**: Sequelize
- **Authentication**: JWT

### Frontend Technologies
- **Framework**: React.js
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI
- **Routing**: React Router
- **Form Handling**: Formik/Yup

## 3. Backend Architecture

### 3.1 Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('student', 'mentor', 'admin') DEFAULT 'student',
    profile_picture TEXT,
    skills TEXT[],
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Courses Table
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    skill_level ENUM('beginner', 'intermediate', 'advanced'),
    duration INTEGER,
    price DECIMAL(10,2),
    instructor_id UUID REFERENCES users(id),
    total_modules INTEGER,
    certification_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Internships Table
```sql
CREATE TABLE internships (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    location VARCHAR(255),
    duration_weeks INTEGER,
    skills_required TEXT[],
    stipend DECIMAL(10,2),
    application_deadline DATE,
    status ENUM('active', 'closed', 'filled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Backend Services

#### Authentication Service
```javascript
class AuthService {
  async register(userData) {
    // 1. Validate input
    // 2. Check email uniqueness
    // 3. Hash password
    // 4. Create user record
    // 5. Generate JWT token
  }

  async login(email, password) {
    // 1. Validate credentials
    // 2. Generate authentication token
    // 3. Return user profile
  }
}
```

#### Course Management Service
```javascript
class CourseService {
  async enrollInCourse(userId, courseId) {
    // 1. Validate course availability
    // 2. Check user eligibility
    // 3. Create enrollment record
    // 4. Initialize progress tracking
  }

  async updateCourseProgress(userId, courseId, progressData) {
    // 1. Update progress percentage
    // 2. Check course completion
    // 3. Generate certificate if completed
  }
}
```

#### Internship Management Service
```javascript
class InternshipService {
  async applyForInternship(userId, internshipId, applicationData) {
    // 1. Validate application eligibility
    // 2. Create application record
    // 3. Notify relevant parties
    // 4. Update application status
  }

  async searchInternships(filters) {
    // 1. Build dynamic search query
    // 2. Apply filters
    // 3. Return matched internships
  }
}
```

## 4. Frontend Architecture

### 4.1 Component Structure
```
src/
├── components/
│   ├── auth/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── PasswordReset.js
│   ├── courses/
│   │   ├── CourseCatalog.js
│   │   ├── CourseDetails.js
│   │   └── CourseProgress.js
│   ├── internships/
│   │   ├── InternshipList.js
│   │   ├── InternshipDetails.js
│   │   └── ApplicationForm.js
│   └── dashboard/
│       ├── UserProfile.js
│       ├── Achievements.js
│       └── Recommendations.js
├── pages/
├── redux/
│   ├── slices/
│   └── store.js
└── App.js
```

### 4.2 Authentication Components
```jsx
function AuthComponent() {
  // 1. Manage authentication state
  // 2. Handle form validations
  // 3. Integrate with backend API
  // 4. Manage JWT token storage
  // 5. Redirect based on authentication status
}
```

### 4.3 Course Management UI
```jsx
function CourseDashboard() {
  // 1. Fetch enrolled courses
  // 2. Display progress
  // 3. Show course recommendations
  // 4. Manage course interactions
}
```

## 5. Security Considerations
- Password Hashing (bcrypt)
- JWT Token Security
- Input Validation
- Role-Based Access Control
- HTTPS Communication
- Protection against:
  - SQL Injection
  - Cross-Site Scripting (XSS)
  - Cross-Site Request Forgery (CSRF)

## 6. Performance Optimization
- Database Indexing
- Caching Mechanisms
- Code Splitting
- Lazy Loading
- Efficient State Management
- Minimized Re-renders

## 7. Deployment Strategy
- Containerization with Docker
- CI/CD Pipeline
- Cloud Deployment (AWS/Azure)
- Environment-Specific Configurations
- Automated Testing

## 8. Future Enhancements
- AI-Powered Course Recommendations
- Advanced Gamification
- Multi-language Support
- Machine Learning Integration
- Real-time Collaboration Features

## 9. Installation & Setup

### Backend Setup
```bash
# Clone repository
git clone https://github.com/yourusername/learning-platform.git

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Install frontend dependencies
cd frontend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API endpoint

# Start development server
npm start
```

## 10. Contributing Guidelines
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 11. License
MIT License - Open-source project


# Learning Platform

A modern learning platform that combines course management and internship opportunities. Built with Node.js, Express, and PostgreSQL.

## Features

### User Management
- User registration and authentication with JWT
- Role-based access control (Student, Instructor, Admin)
- Profile management
- Password reset functionality
- Email verification (TODO)

### Course Management
- Course creation and management by instructors
- Course enrollment for students
- Progress tracking
- Course categories and difficulty levels
- Rich course content support (TODO)

### Internship Platform
- Internship posting by instructors/companies
- Application management
- Student applications with resume/cover letter
- Application status tracking
- Location and type-based filtering

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL with Sequelize ORM
- JWT for authentication
- Winston for logging
- Joi for validation

### Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/change-password - Change password
- POST /api/auth/reset-password-request - Request password reset
- POST /api/auth/reset-password/:token - Reset password

### User Management
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- GET /api/users/courses - Get enrolled courses
- GET /api/users/courses/:courseId/progress - Get course progress
- GET /api/users/applications - Get internship applications

### Course Management
- GET /api/courses - Get all courses
- GET /api/courses/:courseId - Get course by ID
- POST /api/courses - Create course (Instructor)
- PUT /api/courses/:courseId - Update course (Instructor)
- DELETE /api/courses/:courseId - Delete course (Instructor)
- POST /api/courses/:courseId/enroll - Enroll in course (Student)
- PUT /api/courses/:courseId/progress - Update course progress (Student)

### Internship Management
- GET /api/internships - Get all internships
- GET /api/internships/:internshipId - Get internship by ID
- POST /api/internships - Create internship (Instructor)
- PUT /api/internships/:internshipId - Update internship (Instructor)
- DELETE /api/internships/:internshipId - Delete internship (Instructor)
- POST /api/internships/:internshipId/apply - Apply for internship (Student)
- DELETE /api/internships/:internshipId/withdraw - Withdraw application (Student)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.config.js   # Database configuration
│   │   └── logger.js           # Logging configuration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # Authentication middleware
│   │   └── error.middleware.js  # Error handling middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Internship.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── course.routes.js
│   │   └── internship.routes.js
│   ├── utils/
│   │   ├── errors/
│   │   │   └── AppError.js
│   │   ├── responses/
│   │   │   └── apiResponse.js
│   │   └── validation/
│   │       └── validator.js
│   ├── app.js                  # Express app setup
│   └── server.js              # Server entry point
├── logs/                      # Application logs
├── .env                       # Environment variables
├── .gitignore
└── package.json
```

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd learning-platform
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=learning_platform
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Logging
LOG_LEVEL=debug
```

4. Create the database:
```bash
createdb learning_platform
```

5. Start the development server:
```bash
npm run dev
```

## API Documentation

The API documentation is available at `/api-docs` when running in development mode. It includes detailed information about all endpoints, request/response formats, and authentication requirements.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

1. Frontend Development
   - React-based single-page application
   - Responsive design
   - Rich text editor for course content

2. Course Features
   - Video content support
   - Live sessions
   - Quizzes and assignments
   - Certificates

3. Social Features
   - Discussion forums
   - Direct messaging
   - Student groups

4. Analytics
   - Learning progress analytics
   - Instructor dashboard
   - Course performance metrics

5. Payment Integration
   - Course payments
   - Subscription plans
   - Instructor payouts

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Learning Platform Project

A modern web application built with React, Node.js, PostgreSQL, MongoDB, and Redis.

## Prerequisites

- Docker and Docker Compose
- Node.js 18 or higher
- npm or yarn package manager

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd WebProject
```

2. Create a `.env` file in the root directory with the required environment variables (see `.env.example`).

3. Start the development environment:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Development

### Frontend Development
- Located in `/frontend`
- Built with React, Material-UI, and Redux Toolkit
- Uses React Router for navigation
- Includes ErrorBoundary for better error handling

### Backend Development
- Located in `/backend`
- Built with Node.js and Express
- Uses PostgreSQL for relational data
- Uses MongoDB for document storage
- Uses Redis for caching

### Environment Variables

Required environment variables:
- `NODE_ENV`: development/production
- `PORT`: Backend port (default: 4000)
- `POSTGRES_*`: PostgreSQL configuration
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `CORS_ORIGIN`: Frontend URL

## Production Deployment

1. Set environment variables for production:
```bash
NODE_ENV=production docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Project Structure

```
.
├── frontend/                # React frontend
│   ├── src/                # Source files
│   ├── public/             # Static files
│   └── Dockerfile         # Frontend container config
├── backend/                # Node.js backend
│   ├── src/               # Source files
│   ├── config/            # Configuration files
│   ├── models/            # Database models
│   └── Dockerfile        # Backend container config
├── docker-compose.yml     # Docker compose config
└── .env                   # Environment variables
```

## Features

- User Authentication with JWT
- PostgreSQL for structured data
- MongoDB for flexible document storage
- Redis for caching
- Docker containerization
- Development and Production configurations
- Health checks for all services
- Automatic database migrations
- Error boundary for frontend
- Material-UI components

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
