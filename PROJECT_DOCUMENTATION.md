# Learning Platform Project Documentation

## Project Structure

```bash
backend/
├── config/                # Configuration files
│   ├── config.json       # Database configuration
│   ├── database.js       # PostgreSQL connection setup
│   ├── mongodb.js        # MongoDB connection setup
│   └── logger.js         # Logging configuration
├── migrations/           # Database migrations
│   └── postgres/        # PostgreSQL migrations
│       ├── 20250128000000-create-users.js
│       ├── 20250128000001-create-courses.js
│       └── 20250128000002-create-internships.js
├── src/                 # Source code
│   ├── controllers/     # Route controllers
│   │   ├── auth.controller.js
│   │   ├── course.controller.js
│   │   ├── internship.controller.js
│   │   └── user.controller.js
│   ├── docs/           # API and requirements documentation
│   │   ├── AUTH_REQUIREMENTS.md
│   │   ├── COURSE_REQUIREMENTS.md
│   │   └── INTERNSHIP_REQUIREMENTS.md
│   ├── middleware/      # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── performance.middleware.js
│   │   └── security.middleware.js
│   ├── models/          # Database models
│   │   ├── Course.js
│   │   ├── CourseProgress.js
│   │   ├── Internship.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/          # Express routes
│   │   ├── auth.routes.js
│   │   ├── course.routes.js
│   │   ├── internship.routes.js
│   │   └── user.routes.js
│   ├── services/        # Business logic services
│   │   ├── auth/
│   │   │   ├── authentication.service.js
│   │   │   └── index.js
│   │   ├── course/
│   │   │   ├── certificate.service.js
│   │   │   ├── course.service.js
│   │   │   ├── recommendation.service.js
│   │   │   └── index.js
│   │   ├── internship/
│   │   │   ├── application.service.js
│   │   │   ├── eligibility.service.js
│   │   │   ├── internship.service.js
│   │   │   ├── matching.service.js
│   │   │   └── index.js
│   │   └── user/
│   │       ├── skill-assessment.service.js
│   │       └── index.js
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env                # Environment variables
├── .gitignore         # Git ignore file
├── package.json       # Project dependencies
└── README.md         # Project overview
```

## Key Components

### 1. Server Configuration
- `src/server.js`: Entry point with enhanced error handling and graceful shutdown
- `src/app.js`: Express application setup with middleware configuration
- `.env`: Environment variables for configuration

### 2. Database
- **PostgreSQL**: Primary database for structured data
  - Users, courses, and internships
  - Sequelize ORM for database operations
  - Migrations in `migrations/postgres/` directory
- **MongoDB**: Secondary database for unstructured data
  - Course content and user activity logs
  - Mongoose ODM for database operations

### 3. API Routes
All routes are prefixed with `/api`

#### Authentication (`/api/auth`)
- User registration and login
- Password reset functionality
- JWT-based authentication

#### Users (`/api/users`)
- Profile management
- Course enrollment tracking
- User preferences

#### Courses (`/api/courses`)
- Course management
- Enrollment handling
- Progress tracking

#### Internships (`/api/internships`)
- Internship listings
- Application processing
- Status tracking

### 4. Middleware
- **Authentication**: JWT verification and role-based access
- **Error Handling**: Centralized error processing
- **Security**: Headers, rate limiting, and sanitization
- **Performance**: Request timing and resource monitoring

### 5. Development Guidelines

#### Code Style
- ES6+ features
- Consistent naming conventions:
  - Files: lowercase with dots (e.g., `auth.controller.js`)
  - Classes: PascalCase
  - Functions/Variables: camelCase
- Async/await for asynchronous operations
- Proper error handling with try/catch

#### API Design
- RESTful principles
- Consistent error responses
- Proper HTTP status codes
- Input validation

#### Security
- Input validation and sanitization
- Rate limiting
- Secure headers
- CORS configuration

#### Testing
- Unit tests for models
- Integration tests for APIs
- End-to-end testing

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration - PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=learning_platform
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/learning_platform

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=1d

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run migrations: `npm run migrate`
5. Start development server: `npm run dev`

## Scripts

```bash
npm start           # Start production server
npm run dev        # Start development server
npm test           # Run tests
npm run lint       # Run ESLint
npm run migrate    # Run database migrations
npm run seed       # Run database seeders
```

## Contributing

1. Create a feature branch
2. Follow code style guidelines
3. Write/update tests
4. Update documentation
5. Submit pull request

## License

MIT License - see LICENSE file for details
