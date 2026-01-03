/**
 * Search API Service
 */

import api from "./api";

/**
 * Global search
 * @param {string} query - Search query
 * @param {Object} filters - Search filters
 * @returns {Promise} API response with search results
 */
export const globalSearch = async (query, filters = {}) => {
  const response = await api.get("/search", {
    q: query,
    ...filters,
  });
  return response.data;
};

/**
 * Search trips
 * @param {string} query - Search query
 * @param {Object} filters - Search filters
 * @returns {Promise} API response with trips
 */
export const searchTrips = async (query, filters = {}) => {
  const response = await api.get("/search/trips", {
    q: query,
    ...filters,
  });
  return response.data.trips;
};

/**
 * Search users
 * @param {string} query - Search query
 * @returns {Promise} API response with users
 */
export const searchUsers = async (query) => {
  const response = await api.get("/search/users", { q: query });
  return response.data.users;
};

export default {
  globalSearch,
  searchTrips,
  searchUsers,
};
