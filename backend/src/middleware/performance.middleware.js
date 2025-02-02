const logger = require('../config/logger');

/**
 * Performance metrics middleware
 */
const performanceMetrics = (req, res, next) => {
  // Start timer
  const start = process.hrtime();

  // Log when the response is finished
  res.on('finish', () => {
    // Calculate duration
    const duration = process.hrtime(start);
    const durationMs = (duration[0] * 1000) + (duration[1] / 1e6);

    // Log performance metrics
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${durationMs.toFixed(2)}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });

    // Add warning for slow requests
    if (durationMs > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        path: req.path,
        duration: `${durationMs.toFixed(2)}ms`
      });
    }
  });

  next();
};

/**
 * Memory usage monitoring middleware
 */
const memoryMonitor = (req, res, next) => {
  const memoryUsage = process.memoryUsage();
  
  // Convert to MB for readability
  const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

  // Log memory usage if it exceeds thresholds
  if (memoryUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
    logger.warn('High memory usage detected', {
      heapUsed: formatMemoryUsage(memoryUsage.heapUsed),
      heapTotal: formatMemoryUsage(memoryUsage.heapTotal),
      rss: formatMemoryUsage(memoryUsage.rss)
    });
  }

  next();
};

/**
 * CPU usage monitoring middleware
 */
const cpuMonitor = (req, res, next) => {
  const startUsage = process.cpuUsage();

  res.on('finish', () => {
    const endUsage = process.cpuUsage(startUsage);
    const userCPUMs = endUsage.user / 1000; // Convert to milliseconds
    const systemCPUMs = endUsage.system / 1000;

    // Log if CPU usage is high
    if (userCPUMs > 100 || systemCPUMs > 100) {
      logger.warn('High CPU usage detected', {
        userCPU: `${userCPUMs.toFixed(2)}ms`,
        systemCPU: `${systemCPUMs.toFixed(2)}ms`,
        path: req.path,
        method: req.method
      });
    }
  });

  next();
};

module.exports = {
  performanceMetrics,
  memoryMonitor,
  cpuMonitor
};
