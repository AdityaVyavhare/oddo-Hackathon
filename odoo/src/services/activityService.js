/**
 * Activities API Service
 */

import api from "./api";

/**
 * Get activities
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with activities
 */
export const getActivities = async (params = {}) => {
  const response = await api.get("/activities", params);
  return response.data.activities;
};

/**
 * Get activity by ID
 * @param {number} activityId - Activity ID
 * @returns {Promise} API response with activity
 */
export const getActivityById = async (activityId) => {
  const response = await api.get(`/activities/${activityId}`);
  return response.data.activity;
};

/**
 * Search activities
 * @param {string} query - Search query
 * @param {Object} filters - Search filters (city, category, etc.)
 * @returns {Promise} API response with activities
 */
export const searchActivities = async (query, filters = {}) => {
  const response = await api.get("/activities", {
    search: query,
    ...filters,
  });
  return response.data.activities;
};

/**
 * Get activities by city
 * @param {number} cityId - City ID
 * @returns {Promise} API response with activities
 */
export const getActivitiesByCity = async (cityId) => {
  const response = await api.get("/activities", { cityId });
  return response.data.activities;
};

export default {
  getActivities,
  getActivityById,
  searchActivities,
  getActivitiesByCity,
};
