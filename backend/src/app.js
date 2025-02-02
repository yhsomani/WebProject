require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const responseTime = require('response-time');
const { v4: uuidv4 } = require('uuid');
const logger = require('./config/logger');
const { validationResult } = require('express-validator');

logger.info('Starting application...');

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'http://localhost:3000'
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 600 // 10 minutes
};

app.use(cors(corsOptions));

// Add request ID to each request
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  skip: (req) => req.url === '/health'
});

// Apply rate limiting to all routes
app.use(limiter);

// Response compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Compression level (0-9)
}));

// Response time tracking
app.use(responseTime((req, res, time) => {
  if (time > 1000) { // Log slow requests (>1s)
    logger.warn('Slow Request', {
      method: req.method,
      url: req.url,
      time: `${time.toFixed(2)}ms`,
      requestId: req.id
    });
  }
}));

// Logging middleware
app.use(morgan('combined', {
  stream: logger.stream,
  skip: (req) => req.url === '/health'
}));

// Body parsing middleware with limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));

// Initialize models
const initializeApp = async () => {
  try {
    // Initialize models
    const models = await require('./models').init();
    logger.info('Models initialized successfully');

    // API routes
    const routes = require('./routes');

    // Mount routes before other handlers
    app.use('/api/v1', routes);
    logger.info('Routes mounted successfully');

    // Health check endpoint
    app.get('/health', async (req, res) => {
      const startTime = process.hrtime();
      
      try {
        const { getSequelize } = require('./models');
        const sequelize = getSequelize();
        
        if (!sequelize) {
          throw new Error('Database not initialized');
        }
        
        await sequelize.authenticate();
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const responseTimeMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
        
        res.status(200).json({
          status: 'success',
          message: 'Server is healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          cpu: process.cpuUsage(),
          responseTime: `${responseTimeMs}ms`,
          databases: {
            status: 'connected',
            latency: `${responseTimeMs}ms`
          },
          version: process.env.npm_package_version || '1.0.0'
        });
      } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
          status: 'error',
          message: 'Server is experiencing issues',
          timestamp: new Date().toISOString(),
          databases: {
            status: 'disconnected',
            error: error.message
          }
        });
      }
    });

    // Root route handler
    app.get('/', (req, res) => {
      res.json({
        status: 'success',
        message: 'Learning Platform API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        documentation: '/api/docs',
        endpoints: {
          base: '/api/v1',
          auth: {
            base: '/api/v1/auth',
            login: '/api/v1/auth/login',
            register: '/api/v1/auth/register',
            refreshToken: '/api/v1/auth/refresh-token',
            forgotPassword: '/api/v1/auth/forgot-password',
            resetPassword: '/api/v1/auth/reset-password'
          },
          users: {
            base: '/api/v1/users',
            profile: '/api/v1/users/profile',
            settings: '/api/v1/users/settings'
          },
          courses: {
            base: '/api/v1/courses',
            list: '/api/v1/courses',
            search: '/api/v1/courses/search',
            enroll: '/api/v1/courses/:id/enroll'
          },
          internships: {
            base: '/api/v1/internships',
            list: '/api/v1/internships',
            apply: '/api/v1/internships/:id/apply'
          }
        },
        health: '/health'
      });
    });

    // API Documentation route
    app.get('/api/docs', (req, res) => {
      res.json({
        status: 'success',
        message: 'API Documentation',
        version: '1.0.0',
        apiSpecification: {
          openapi: '3.0.0',
          info: {
            title: 'Learning Platform API',
            version: '1.0.0',
            description: 'API documentation for the Learning Platform'
          },
          servers: [
            {
              url: process.env.NODE_ENV === 'production' 
                ? process.env.API_URL 
                : 'http://localhost:4000',
              description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
            }
          ],
          security: [
            {
              bearerAuth: []
            }
          ],
          paths: {
            '/api/v1/auth/login': {
              post: {
                summary: 'User login',
                requestBody: {
                  required: true,
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          email: {
                            type: 'string',
                            format: 'email'
                          },
                          password: {
                            type: 'string',
                            format: 'password'
                          }
                        },
                        required: ['email', 'password']
                      }
                    }
                  }
                },
                responses: {
                  '200': {
                    description: 'Successful login',
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                          properties: {
                            token: {
                              type: 'string'
                            },
                            user: {
                              type: 'object'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
    });

    // 404 Handler - Place this after all valid routes
    app.use((req, res) => {
      logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
      res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        requestId: req.id,
        availableEndpoints: {
          auth: '/api/v1/auth/*',
          users: '/api/v1/users/*',
          courses: '/api/v1/courses/*',
          internships: '/api/v1/internships/*'
        }
      });
    });

    // Request validation middleware with detailed error messages
    app.use((req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Validation error:', errors.array());
        return res.status(400).json({ 
          status: 'error',
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.param,
            message: err.msg,
            value: err.value
          }))
        });
      }
      next();
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      logger.error('Error:', {
        error: err.message,
        stack: err.stack,
        requestId: req.id
      });

      // Handle validation errors
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          status: 'error',
          message: 'Validation Error',
          errors: err.errors,
          requestId: req.id
        });
      }

      // Handle database errors
      if (err.name === 'SequelizeError' || err.name === 'SequelizeValidationError') {
        return res.status(400).json({
          status: 'error',
          message: 'Database Error',
          errors: err.errors,
          requestId: req.id
        });
      }

      // Handle unauthorized errors
      if (err.name === 'UnauthorizedError' || err.status === 401) {
        return res.status(401).json({
          status: 'error',
          message: err.message || 'Unauthorized',
          requestId: req.id
        });
      }

      // Handle forbidden errors
      if (err.status === 403) {
        return res.status(403).json({
          status: 'error',
          message: err.message || 'Forbidden',
          requestId: req.id
        });
      }

      // Handle not found errors
      if (err.status === 404) {
        return res.status(404).json({
          status: 'error',
          message: err.message || 'Not Found',
          requestId: req.id
        });
      }

      // Default error
      res.status(err.status || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
        requestId: req.id,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
      });
    });

    logger.info('Application setup complete');
    return app;
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    throw error;
  }
};

module.exports = initializeApp;
