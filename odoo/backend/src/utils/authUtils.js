const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if match
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || "your-secret-key-change-in-production",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - Token payload
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET ||
      "your-refresh-secret-key-change-in-production",
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

/**
 * Generate random username from email
 * @param {string} email - User email
 * @returns {string} Generated username
 */
const generateUsername = (email) => {
  const emailPrefix = email.split("@")[0].toLowerCase();
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `${emailPrefix}${randomSuffix}`.replace(/[^a-z0-9_]/g, "_");
};

module.exports = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateUsername,
};
