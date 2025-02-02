class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message) {
    return new AppError(message, 400);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Forbidden access') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  static conflict(message) {
    return new AppError(message, 409);
  }

  static validationError(message) {
    return new AppError(message, 422);
  }

  static internalError(message = 'Something went wrong') {
    return new AppError(message, 500);
  }
}

module.exports = AppError;
