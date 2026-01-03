const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  handleValidationErrors,
} = require("../middleware/validators/authValidator");
const {
  updateProfileValidation,
  updatePreferencesValidation,
  changePasswordValidation,
  deleteAccountValidation,
  userIdParamValidation,
} = require("../middleware/validators/userValidator");
const { uploadProfilePicture } = require("../middleware/uploadMiddleware");
const {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  getPublicProfile,
  deleteAccount,
  getUserStatistics,
} = require("../controllers/userController");

// Get current user profile
router.get("/profile", authMiddleware, getProfile);

// Update current user profile (with optional profile picture)
router.put(
  "/profile",
  authMiddleware,
  uploadProfilePicture,
  updateProfileValidation,
  handleValidationErrors,
  updateProfile
);

// Update user preferences
router.patch(
  "/preferences",
  authMiddleware,
  updatePreferencesValidation,
  handleValidationErrors,
  updatePreferences
);

// Change password
router.put(
  "/password",
  authMiddleware,
  changePasswordValidation,
  handleValidationErrors,
  changePassword
);

// Delete account
router.delete(
  "/account",
  authMiddleware,
  deleteAccountValidation,
  handleValidationErrors,
  deleteAccount
);

// Get public user profile
router.get(
  "/:userId",
  userIdParamValidation,
  handleValidationErrors,
  getPublicProfile
);

// Get user statistics
router.get(
  "/:userId/stats",
  userIdParamValidation,
  handleValidationErrors,
  getUserStatistics
);

module.exports = router;
