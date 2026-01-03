const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
  handleValidationErrors,
} = require("../middleware/validators/authValidator");
const {
  uploadProfilePicture,
  handleUploadError,
  processUploadedFile,
} = require("../middleware/uploadMiddleware");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  uploadProfilePicture,
  handleUploadError,
  processUploadedFile,
  registerValidation,
  handleValidationErrors,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  authController.login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private (requires authentication middleware)
 */
// router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
