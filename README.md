# Learning Platform

A modern, containerized learning platform built with React and Node.js, featuring a microservices architecture.

## 🚀 Project Overview

This project is a comprehensive learning platform that provides a robust backend API and a modern frontend interface. The application is containerized using Docker for consistent development and deployment environments.

## 🏗️ Architecture

The project follows a microservices architecture with the following main components:

- **Frontend**: React-based SPA
- **Backend**: Node.js API server
- **Databases**: 
  - MongoDB for main data storage
  - PostgreSQL for relational data
  - SQLite for lightweight storage

## 🛠️ Tech Stack

### Frontend
- React
- Modern development and production Dockerfiles
- Nginx for production serving
- ESLint for code quality

### Backend
- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication
- Multi-database support
- Logging system

### Infrastructure
- Docker & Docker Compose
- Nginx
- Development & Production environments
- Certificate management

## 📁 Project Structure

```
.
├── frontend/                # React frontend application
│   ├── src/                # Source code
│   ├── public/             # Static files
│   └── nginx.conf         # Nginx configuration
├── backend/                # Node.js backend application
│   ├── src/               # Source code
│   ├── controllers/       # Route controllers
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── config/           # Configuration files
│   ├── migrations/       # Database migrations
│   └── certificates/     # SSL/TLS certificates
└── docker-compose.yml    # Docker services configuration
```

## 🔧 Key Features

### Core Functionality
1. **Authentication System**
   - User registration with email verification
   - JWT authentication with optional 2FA
   - Role-based access control (Admin, Instructor, Student)

2. **Course Management**
   - Course creation and organization
   - Content management (modules, lessons, quizzes)
   - Progress tracking and analytics

3. **Learning Experience**
   - Interactive lesson viewer
   - Progress tracking
   - Bookmarking and annotations
   - Learning path recommendations

4. **Assessment & Certification**
   - Quiz creation and automated grading
   - Course completion certificates
   - Performance analytics

5. **Projects & Internships**
   - Project submission and review system
   - Internship management
   - Mentor assignment

### Technical Features
- Hot-reloading for development
- Comprehensive logging system
- Database migrations
- Code quality tools
- SSL/TLS support
- Environment-based configurations

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development environment:
   ```bash
   docker-compose up
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 📱 UI Structure

### Routes
1. **Public Routes**
   ```
   /                 → Home page
   /login           → Login page
   /register        → Registration page
   /courses         → Course catalog
   ```

2. **Authenticated Routes**
   ```
   /dashboard       → User dashboard
   /courses/:id     → Course details
   /learn/:courseId → Learning interface
   /profile        → User profile
   /certificates   → User certificates
   ```

3. **Admin Routes**
   ```
   /admin/dashboard → Admin overview
   /admin/users     → User management
   /admin/courses   → Course management
   /admin/reports   → Analytics
   ```

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## 🔄 Development Workflow

### Testing Strategy
- Unit testing with Jest
- Integration testing
- Performance testing with k6
- Load and stress testing

### CI/CD Pipeline
```yaml
name: CI/CD
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Test
        run: |
          npm ci
          npm test
          npm run build
```

### Optimization Strategies
- Code splitting and lazy loading
- Redis caching
- CDN integration
- Database indexing
- Container optimization
- API request batching

## 📝 Logging

The application includes a comprehensive logging system with configurable log levels. Logs are stored in the `backend/logs` directory.

## 📄 License

[Yash_Somani]
