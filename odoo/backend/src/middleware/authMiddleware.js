const { verifyToken } = require("../utils/authUtils");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/User");

/**
 * Authentication middleware to verify JWT token
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.unauthorized(res, "No token provided");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.is_active) {
      return ApiResponse.unauthorized(res, "Invalid token or user not found");
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      role: user.role || "user",
    };

    next();
  } catch (error) {
    if (error.message === "Invalid or expired token") {
      return ApiResponse.unauthorized(res, "Invalid or expired token");
    }
    return ApiResponse.unauthorized(res, "Authentication failed");
  }
};

module.exports = authMiddleware;
