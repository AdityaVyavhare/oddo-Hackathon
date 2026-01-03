/**
 * Trips API Service
 * Handles all trip-related API calls
 */

import api from "./api";

/**
 * Get all trips for current user
 * @returns {Promise} API response with trips array
 */
export const getUserTrips = async () => {
  const response = await api.get("/trips/my-trips");
  return response.data.trips;
};

/**
 * Get trip by ID
 * @param {number} tripId - Trip ID
 * @returns {Promise} API response with trip data
 */
export const getTripById = async (tripId) => {
  const response = await api.get(`/trips/${tripId}`);
  return response.data.trip;
};

/**
 * Create a new trip
 * @param {Object} tripData - Trip data
 * @returns {Promise} API response
 */
export const createTrip = async (tripData) => {
  const response = await api.post("/trips", tripData);
  return response.data.trip;
};

/**
 * Update trip
 * @param {number} tripId - Trip ID
 * @param {Object} updates - Trip updates
 * @returns {Promise} API response
 */
export const updateTrip = async (tripId, updates) => {
  const response = await api.put(`/trips/${tripId}`, updates);
  return response.data.trip;
};

/**
 * Delete trip
 * @param {number} tripId - Trip ID
 * @returns {Promise} API response
 */
export const deleteTrip = async (tripId) => {
  const response = await api.delete(`/trips/${tripId}`);
  return response;
};

/**
 * Get public trips
 * @param {Object} params - Query parameters (limit, offset, etc.)
 * @returns {Promise} API response with trips
 */
export const getPublicTrips = async (params = {}) => {
  const response = await api.get("/trips/public", params);
  return response.data.trips;
};

/**
 * Get trip by share token
 * @param {string} shareToken - Share token
 * @returns {Promise} API response with trip
 */
export const getTripByShareToken = async (shareToken) => {
  const response = await api.get(`/trips/shared/${shareToken}`);
  return response.data.trip;
};

/**
 * Like a trip
 * @param {number} tripId - Trip ID
 * @returns {Promise} API response
 */
export const likeTrip = async (tripId) => {
  const response = await api.post(`/trips/${tripId}/like`);
  return response;
};

/**
 * Unlike a trip
 * @param {number} tripId - Trip ID
 * @returns {Promise} API response
 */
export const unlikeTrip = async (tripId) => {
  const response = await api.delete(`/trips/${tripId}/like`);
  return response;
};

/**
 * Clone a trip
 * @param {number} tripId - Trip ID to clone
 * @returns {Promise} API response with new trip
 */
export const cloneTrip = async (tripId) => {
  const response = await api.post(`/trips/${tripId}/clone`);
  return response.data.trip;
};

// Trip Stops
/**
 * Get trip stops
 * @param {number} tripId - Trip ID
 * @returns {Promise} API response with stops
 */
export const getTripStops = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/stops`);
  return response.data.stops;
};

/**
 * Create trip stop
 * @param {number} tripId - Trip ID
 * @param {Object} stopData - Stop data
 * @returns {Promise} API response
 */
export const createTripStop = async (tripId, stopData) => {
  const response = await api.post(`/trips/${tripId}/stops`, stopData);
  return response.data.stop;
};

/**
 * Update trip stop
 * @param {number} tripId - Trip ID
 * @param {number} stopId - Stop ID
 * @param {Object} updates - Stop updates
 * @returns {Promise} API response
 */
export const updateTripStop = async (tripId, stopId, updates) => {
  const response = await api.put(`/trips/${tripId}/stops/${stopId}`, updates);
  return response.data.stop;
};

/**
 * Delete trip stop
 * @param {number} tripId - Trip ID
 * @param {number} stopId - Stop ID
 * @returns {Promise} API response
 */
export const deleteTripStop = async (tripId, stopId) => {
  const response = await api.delete(`/trips/${tripId}/stops/${stopId}`);
  return response;
};

// Itinerary
/**
 * Get trip itinerary
 * @param {number} tripId - Trip ID
 * @returns {Promise} API response with itinerary
 */
export const getTripItinerary = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/itinerary`);
  return response.data.itinerary;
};

/**
 * Create itinerary item
 * @param {number} tripId - Trip ID
 * @param {number} stopId - Stop ID
 * @param {Object} itemData - Itinerary item data
 * @returns {Promise} API response
 */
export const createItineraryItem = async (tripId, stopId, itemData) => {
  const response = await api.post(
    `/trips/${tripId}/stops/${stopId}/itinerary`,
    itemData
  );
  return response.data.item;
};

/**
 * Update itinerary item
 * @param {number} tripId - Trip ID
 * @param {number} itemId - Item ID
 * @param {Object} updates - Item updates
 * @returns {Promise} API response
 */
export const updateItineraryItem = async (tripId, itemId, updates) => {
  const response = await api.put(
    `/trips/${tripId}/itinerary/${itemId}`,
    updates
  );
  return response.data.item;
};

/**
 * Delete itinerary item
 * @param {number} tripId - Trip ID
 * @param {number} itemId - Item ID
 * @returns {Promise} API response
 */
export const deleteItineraryItem = async (tripId, itemId) => {
  const response = await api.delete(`/trips/${tripId}/itinerary/${itemId}`);
  return response;
};

// Expenses
/**
 * Get trip expenses
 * @param {number} tripId - Trip ID
 * @returns {Promise} API response with expenses
 */
export const getTripExpenses = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/expenses`);
  return response.data.expenses;
};

/**
 * Create expense
 * @param {number} tripId - Trip ID
 * @param {Object} expenseData - Expense data
 * @returns {Promise} API response
 */
export const createExpense = async (tripId, expenseData) => {
  const response = await api.post(`/trips/${tripId}/expenses`, expenseData);
  return response.data.expense;
};

/**
 * Update expense
 * @param {number} tripId - Trip ID
 * @param {number} expenseId - Expense ID
 * @param {Object} updates - Expense updates
 * @returns {Promise} API response
 */
export const updateExpense = async (tripId, expenseId, updates) => {
  const response = await api.put(
    `/trips/${tripId}/expenses/${expenseId}`,
    updates
  );
  return response.data.expense;
};

/**
 * Delete expense
 * @param {number} tripId - Trip ID
 * @param {number} expenseId - Expense ID
 * @returns {Promise} API response
 */
export const deleteExpense = async (tripId, expenseId) => {
  const response = await api.delete(`/trips/${tripId}/expenses/${expenseId}`);
  return response;
};

/**
 * Get budget summary
 * @param {number} tripId - Trip ID
 * @returns {Promise} API response with budget summary
 */
export const getBudgetSummary = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/budget/summary`);
  return response.data.summary;
};

export default {
  getUserTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getPublicTrips,
  getTripByShareToken,
  likeTrip,
  unlikeTrip,
  cloneTrip,
  getTripStops,
  createTripStop,
  updateTripStop,
  deleteTripStop,
  getTripItinerary,
  createItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  getTripExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getBudgetSummary,
};
