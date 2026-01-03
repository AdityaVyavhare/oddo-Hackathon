/**
 * Cities and Countries API Service
 */

import api from "./api";

/**
 * Get all countries
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with countries
 */
export const getCountries = async (params = {}) => {
  const response = await api.get("/countries", params);
  return response.data.countries;
};

/**
 * Get country by ID
 * @param {number} countryId - Country ID
 * @returns {Promise} API response with country
 */
export const getCountryById = async (countryId) => {
  const response = await api.get(`/countries/${countryId}`);
  return response.data.country;
};

/**
 * Get cities
 * @param {Object} params - Query parameters (country, search, etc.)
 * @returns {Promise} API response with cities
 */
export const getCities = async (params = {}) => {
  const response = await api.get("/cities", params);
  return response.data.cities;
};

/**
 * Get city by ID
 * @param {number} cityId - City ID
 * @returns {Promise} API response with city
 */
export const getCityById = async (cityId) => {
  const response = await api.get(`/cities/${cityId}`);
  return response.data.city;
};

/**
 * Search cities
 * @param {string} query - Search query
 * @returns {Promise} API response with cities
 */
export const searchCities = async (query) => {
  const response = await api.get("/cities", { search: query });
  return response.data.cities;
};

export default {
  getCountries,
  getCountryById,
  getCities,
  getCityById,
  searchCities,
};
