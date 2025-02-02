class ApiResponse {
  constructor(success, message, data = null, meta = null) {
    this.success = success;
    this.message = message;
    if (data) this.data = data;
    if (meta) this.meta = meta;
  }

  static success(message, data = null, meta = null) {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message, errors = null, meta = null) {
    const response = new ApiResponse(false, message);
    if (errors) response.errors = errors;
    if (meta) response.meta = meta;
    return response;
  }

  static paginated(message, data, page, limit, total) {
    return new ApiResponse(true, message, data, {
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }

  static list(message, data, count) {
    return new ApiResponse(true, message, data, { count });
  }
}

module.exports = {
  ApiResponse,
  
  // Common response messages
  messages: {
    // Success messages
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Resource fetched successfully',
    LISTED: 'Resources listed successfully',
    
    // Error messages
    NOT_FOUND: 'Resource not found',
    INVALID_REQUEST: 'Invalid request',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
    
    // Auth messages
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTRATION_SUCCESS: 'Registration successful',
    PASSWORD_CHANGED: 'Password changed successfully',
    PASSWORD_RESET: 'Password reset successful',
    EMAIL_SENT: 'Email sent successfully',
    
    // Course messages
    COURSE_CREATED: 'Course created successfully',
    COURSE_UPDATED: 'Course updated successfully',
    COURSE_DELETED: 'Course deleted successfully',
    COURSE_ENROLLED: 'Successfully enrolled in course',
    COURSE_COMPLETED: 'Course completed successfully',
    
    // Internship messages
    INTERNSHIP_CREATED: 'Internship created successfully',
    INTERNSHIP_UPDATED: 'Internship updated successfully',
    INTERNSHIP_DELETED: 'Internship deleted successfully',
    APPLICATION_SUBMITTED: 'Application submitted successfully',
    APPLICATION_UPDATED: 'Application updated successfully'
  }
};
