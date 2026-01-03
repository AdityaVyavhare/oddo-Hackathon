/**
 * Standard API response formatter
 */
class ApiResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Object} data - Response data
   * @param {Object} meta - Additional metadata
   */
  static success(
    res,
    statusCode = 200,
    message = "Success",
    data = null,
    meta = null
  ) {
    const response = {
      success: true,
      message,
      data,
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Array of error details
   */
  static error(res, statusCode = 500, message = "Error", errors = null) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Validation error response
   * @param {Object} res - Express response object
   * @param {Array} errors - Validation errors
   */
  static validationError(res, errors) {
    return this.error(res, 400, "Validation failed", errors);
  }

  /**
   * Unauthorized response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static unauthorized(res, message = "Unauthorized access") {
    return this.error(res, 401, message);
  }

  /**
   * Forbidden response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static forbidden(res, message = "Access forbidden") {
    return this.error(res, 403, message);
  }

  /**
   * Not found response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static notFound(res, message = "Resource not found") {
    return this.error(res, 404, message);
  }

  /**
   * Conflict response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static conflict(res, message = "Resource already exists") {
    return this.error(res, 409, message);
  }

  /**
   * Server error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static serverError(res, message = "Internal server error") {
    return this.error(res, 500, message);
  }
}

module.exports = ApiResponse;
