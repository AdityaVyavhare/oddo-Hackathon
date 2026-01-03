const Search = require("../models/Search");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Global search
 */
const globalSearch = async (req, res) => {
  try {
    const { q, type, limit } = req.query;

    if (!q || q.trim().length === 0) {
      return ApiResponse.error(res, "Search query is required", 400);
    }

    if (q.length < 2) {
      return ApiResponse.error(
        res,
        "Search query must be at least 2 characters",
        400
      );
    }

    const filters = {
      type, // 'trips', 'cities', 'activities', 'users', or undefined for all
      limit: parseInt(limit) || 10,
    };

    const results = await Search.globalSearch(q, filters);
    return ApiResponse.success(res, results, "Search completed successfully");
  } catch (error) {
    console.error("Global search error:", error);
    return ApiResponse.error(res, "Search failed", 500);
  }
};

/**
 * Search trips
 */
const searchTrips = async (req, res) => {
  try {
    const { q, minLikes, limit, offset } = req.query;

    if (!q || q.trim().length === 0) {
      return ApiResponse.error(res, "Search query is required", 400);
    }

    const filters = {
      minLikes: parseInt(minLikes),
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
    };

    const trips = await Search.searchTrips(q, filters);
    return ApiResponse.success(res, trips, "Trips search completed");
  } catch (error) {
    console.error("Search trips error:", error);
    return ApiResponse.error(res, "Failed to search trips", 500);
  }
};

/**
 * Search users
 */
const searchUsers = async (req, res) => {
  try {
    const { q, limit, offset } = req.query;

    if (!q || q.trim().length === 0) {
      return ApiResponse.error(res, "Search query is required", 400);
    }

    const filters = {
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
    };

    const users = await Search.searchUsers(q, filters);
    return ApiResponse.success(res, users, "Users search completed");
  } catch (error) {
    console.error("Search users error:", error);
    return ApiResponse.error(res, "Failed to search users", 500);
  }
};

/**
 * Get recommended trips
 */
const getRecommendedTrips = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit } = req.query;

    const filters = {
      limit: parseInt(limit) || 20,
    };

    const trips = await Search.getRecommendedTrips(userId, filters);
    return ApiResponse.success(
      res,
      trips,
      "Recommended trips retrieved successfully"
    );
  } catch (error) {
    console.error("Get recommended trips error:", error);
    return ApiResponse.error(res, "Failed to get recommended trips", 500);
  }
};

/**
 * Get recommended activities for a city
 */
const getRecommendedActivities = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { limit } = req.query;
    const userId = req.user?.userId; // Optional auth

    const activities = await Search.getRecommendedActivities(
      cityId,
      userId,
      parseInt(limit) || 10
    );

    return ApiResponse.success(
      res,
      activities,
      "Recommended activities retrieved successfully"
    );
  } catch (error) {
    console.error("Get recommended activities error:", error);
    return ApiResponse.error(res, "Failed to get recommended activities", 500);
  }
};

/**
 * Get trending destinations
 */
const getTrendingDestinations = async (req, res) => {
  try {
    const { limit, timeframe } = req.query;

    const destinations = await Search.getTrendingDestinations(
      parseInt(limit) || 10,
      parseInt(timeframe) || 30
    );

    return ApiResponse.success(
      res,
      destinations,
      "Trending destinations retrieved successfully"
    );
  } catch (error) {
    console.error("Get trending destinations error:", error);
    return ApiResponse.error(res, "Failed to get trending destinations", 500);
  }
};

module.exports = {
  globalSearch,
  searchTrips,
  searchUsers,
  getRecommendedTrips,
  getRecommendedActivities,
  getTrendingDestinations,
};
