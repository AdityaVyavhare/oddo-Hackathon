/**
 * User API Service
 * Handles all user-related API calls
 */

import api from "./api";

/**
 * Get current user profile
 * @returns {Promise} API response with user profile
 */
export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data.user;
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} API response
 */
export const updateProfile = async (profileData) => {
  const formData = new FormData();

  // Add all profile fields to FormData
  Object.keys(profileData).forEach((key) => {
    if (profileData[key] !== null && profileData[key] !== undefined) {
      formData.append(key, profileData[key]);
    }
  });

  const response = await api.put("/users/profile", formData);
  return response.data.user;
};

/**
 * Update user preferences
 * @param {Object} preferences - User preferences
 * @returns {Promise} API response
 */
export const updatePreferences = async (preferences) => {
  const response = await api.patch("/users/preferences", preferences);
  return response.data.user;
};

/**
 * Change password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} API response
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put("/users/password", {
    currentPassword,
    newPassword,
  });
  return response;
};

/**
 * Get public user profile
 * @param {number} userId - User ID
 * @returns {Promise} API response with public profile
 */
export const getPublicProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data.user;
};

/**
 * Delete user account
 * @param {string} password - User password for confirmation
 * @returns {Promise} API response
 */
export const deleteAccount = async (password) => {
  const response = await api.delete("/users/account", { password });
  return response;
};

/**
 * Get user statistics
 * @returns {Promise} API response with user statistics
 */
export const getUserStatistics = async () => {
  const response = await api.get("/users/statistics");
  return response.data.statistics;
};

export default {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  getPublicProfile,
  deleteAccount,
  getUserStatistics,
};
