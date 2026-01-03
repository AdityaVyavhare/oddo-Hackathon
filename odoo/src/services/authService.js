/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import api from "./api";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} API response
 */
export const register = async (userData) => {
  const formData = new FormData();

  // Add all user fields to FormData
  Object.keys(userData).forEach((key) => {
    if (userData[key] !== null && userData[key] !== undefined) {
      formData.append(key, userData[key]);
    }
  });

  const response = await api.post("/auth/register", formData);

  // Store auth token if registration successful
  if (response.success && response.data.token) {
    api.setAuthToken(response.data.token);
    localStorage.setItem("currentUserId", response.data.user.userId);
  }

  return response;
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} API response
 */
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });

  // Store auth token and user ID
  if (response.success && response.data.token) {
    api.setAuthToken(response.data.token);
    localStorage.setItem("currentUserId", response.data.user.userId);
  }

  return response;
};

/**
 * Logout user
 */
export const logout = () => {
  api.removeAuthToken();
  return Promise.resolve();
};

/**
 * Get current user profile
 * @returns {Promise} API response with user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data.user;
  } catch (error) {
    // If unauthorized, clear auth data
    if (error.status === 401) {
      api.removeAuthToken();
    }
    throw error;
  }
};

/**
 * Refresh authentication token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} API response
 */
export const refreshToken = async (refreshToken) => {
  const response = await api.post("/auth/refresh", { refreshToken });

  if (response.success && response.data.token) {
    api.setAuthToken(response.data.token);
  }

  return response;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
};
