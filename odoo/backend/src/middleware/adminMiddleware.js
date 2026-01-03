const ApiResponse = require("../utils/ApiResponse");

/**
 * Middleware to check if user is admin
 */
const adminMiddleware = (req, res, next) => {
  try {
    // Assuming user role is set during authentication
    if (!req.user) {
      return ApiResponse.error(res, "Authentication required", 401);
    }

    if (req.user.role !== "admin") {
      return ApiResponse.error(res, "Admin access required", 403);
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return ApiResponse.error(res, "Authorization failed", 500);
  }
};

module.exports = adminMiddleware;
