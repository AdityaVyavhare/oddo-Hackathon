const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/authUtils");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    const userData = {
      userId: user.user_id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePictureUrl: user.profile_picture_url,
      bio: user.bio,
      phoneNumber: user.phone_number,
      dateOfBirth: user.date_of_birth,
      nationality: user.nationality,
      preferredCurrency: user.preferred_currency,
      preferredLanguage: user.preferred_language,
      isActive: user.is_active,
      isPremium: user.is_premium,
      totalTripsCreated: user.total_trips_created,
      totalCountriesVisited: user.total_countries_visited,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
    };

    return ApiResponse.success(
      res,
      200,
      "Profile retrieved successfully",
      userData
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve profile");
  }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      firstName,
      lastName,
      bio,
      phoneNumber,
      dateOfBirth,
      nationality,
    } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (phoneNumber !== undefined) updateData.phone_number = phoneNumber;
    if (dateOfBirth !== undefined) updateData.date_of_birth = dateOfBirth;
    if (nationality !== undefined) updateData.nationality = nationality;

    // Handle profile picture from file upload
    if (req.file) {
      updateData.profile_picture_url = `/uploads/profiles/${req.file.filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      return ApiResponse.badRequest(res, "No fields to update");
    }

    await User.updateProfile(userId, updateData);

    // Get updated user data
    const updatedUser = await User.findById(userId);

    const userData = {
      userId: updatedUser.user_id,
      email: updatedUser.email,
      username: updatedUser.username,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      profilePictureUrl: updatedUser.profile_picture_url,
      bio: updatedUser.bio,
      phoneNumber: updatedUser.phone_number,
      dateOfBirth: updatedUser.date_of_birth,
      nationality: updatedUser.nationality,
      preferredCurrency: updatedUser.preferred_currency,
      preferredLanguage: updatedUser.preferred_language,
    };

    return ApiResponse.success(
      res,
      200,
      "Profile updated successfully",
      userData
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return ApiResponse.serverError(res, "Failed to update profile");
  }
};

/**
 * Update user preferences
 * @route PATCH /api/users/preferences
 * @access Private
 */
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { preferredCurrency, preferredLanguage } = req.body;

    const updateData = {};
    if (preferredCurrency) updateData.preferred_currency = preferredCurrency;
    if (preferredLanguage) updateData.preferred_language = preferredLanguage;

    if (Object.keys(updateData).length === 0) {
      return ApiResponse.badRequest(res, "No preferences to update");
    }

    await User.updateProfile(userId, updateData);

    const updatedUser = await User.findById(userId);

    return ApiResponse.success(res, 200, "Preferences updated successfully", {
      preferredCurrency: updatedUser.preferred_currency,
      preferredLanguage: updatedUser.preferred_language,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return ApiResponse.serverError(res, "Failed to update preferences");
  }
};

/**
 * Change password
 * @route PUT /api/users/password
 * @access Private
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Get user with password hash
    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Verify current password
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password_hash
    );
    if (!isPasswordValid) {
      return ApiResponse.unauthorized(res, "Current password is incorrect");
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await User.updatePassword(userId, newPasswordHash);

    return ApiResponse.success(res, 200, "Password changed successfully");
  } catch (error) {
    console.error("Change password error:", error);
    return ApiResponse.serverError(res, "Failed to change password");
  }
};

/**
 * Get public user profile
 * @route GET /api/users/:userId
 * @access Public
 */
const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Get user statistics
    const stats = await User.getUserStats(userId);

    const publicData = {
      userId: user.user_id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePictureUrl: user.profile_picture_url,
      bio: user.bio,
      nationality: user.nationality,
      totalTripsCreated: stats?.total_trips || 0,
      completedTrips: stats?.completed_trips || 0,
      countriesVisited: stats?.countries_visited || 0,
      citiesVisited: stats?.cities_visited || 0,
      followerCount: stats?.follower_count || 0,
      followingCount: stats?.following_count || 0,
    };

    return ApiResponse.success(
      res,
      200,
      "Public profile retrieved successfully",
      publicData
    );
  } catch (error) {
    console.error("Get public profile error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve profile");
  }
};

/**
 * Delete user account
 * @route DELETE /api/users/account
 * @access Private
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { password } = req.body;

    // Get user with password hash
    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Verify password before deletion
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return ApiResponse.unauthorized(
        res,
        "Password is incorrect. Account deletion cancelled."
      );
    }

    // Soft delete: deactivate account
    await User.deactivateAccount(userId);

    return ApiResponse.success(
      res,
      200,
      "Account deactivated successfully. Your data will be permanently deleted in 30 days."
    );
  } catch (error) {
    console.error("Delete account error:", error);
    return ApiResponse.serverError(res, "Failed to delete account");
  }
};

/**
 * Get user statistics
 * @route GET /api/users/:userId/stats
 * @access Public
 */
const getUserStatistics = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await User.getUserStats(userId);
    if (!stats) {
      return ApiResponse.notFound(res, "User not found");
    }

    return ApiResponse.success(
      res,
      200,
      "User statistics retrieved successfully",
      stats
    );
  } catch (error) {
    console.error("Get user stats error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve statistics");
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  getPublicProfile,
  deleteAccount,
  getUserStatistics,
};
