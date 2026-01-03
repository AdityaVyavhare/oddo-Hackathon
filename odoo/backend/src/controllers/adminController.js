const Admin = require("../models/Admin");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Get all users
 */
const getAllUsers = async (req, res) => {
  try {
    const filters = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
      isActive:
        req.query.isActive === "true"
          ? 1
          : req.query.isActive === "false"
          ? 0
          : undefined,
      role: req.query.role,
      search: req.query.search,
    };

    const result = await Admin.getAllUsers(filters);
    return ApiResponse.success(res, result, "Users retrieved successfully");
  } catch (error) {
    console.error("Get all users error:", error);
    return ApiResponse.error(res, "Failed to retrieve users", 500);
  }
};

/**
 * Update user status
 */
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return ApiResponse.error(res, "isActive must be a boolean", 400);
    }

    // Prevent admin from deactivating themselves
    if (parseInt(userId) === req.user.userId && !isActive) {
      return ApiResponse.error(
        res,
        "You cannot deactivate your own account",
        400
      );
    }

    const result = await Admin.updateUserStatus(userId, isActive);

    if (result.affectedRows === 0) {
      return ApiResponse.error(res, "User not found", 404);
    }

    return ApiResponse.success(
      res,
      { userId, isActive },
      `User ${isActive ? "activated" : "deactivated"} successfully`
    );
  } catch (error) {
    console.error("Update user status error:", error);
    return ApiResponse.error(res, "Failed to update user status", 500);
  }
};

/**
 * Get all trips
 */
const getAllTrips = async (req, res) => {
  try {
    const filters = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
      isPublic:
        req.query.isPublic === "true"
          ? 1
          : req.query.isPublic === "false"
          ? 0
          : undefined,
      userId: req.query.userId,
    };

    const result = await Admin.getAllTrips(filters);
    return ApiResponse.success(res, result, "Trips retrieved successfully");
  } catch (error) {
    console.error("Get all trips error:", error);
    return ApiResponse.error(res, "Failed to retrieve trips", 500);
  }
};

/**
 * Delete trip
 */
const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const result = await Admin.deleteTrip(tripId);

    if (result.affectedRows === 0) {
      return ApiResponse.error(res, "Trip not found", 404);
    }

    return ApiResponse.success(res, null, "Trip deleted successfully");
  } catch (error) {
    console.error("Delete trip error:", error);
    return ApiResponse.error(res, "Failed to delete trip", 500);
  }
};

/**
 * Get platform statistics
 */
const getPlatformStatistics = async (req, res) => {
  try {
    const stats = await Admin.getPlatformStatistics();
    return ApiResponse.success(res, stats, "Statistics retrieved successfully");
  } catch (error) {
    console.error("Get platform statistics error:", error);
    return ApiResponse.error(res, "Failed to retrieve statistics", 500);
  }
};

/**
 * Add new city
 */
const addCity = async (req, res) => {
  try {
    const {
      cityName,
      countryId,
      continent,
      latitude,
      longitude,
      description,
      imageUrl,
      isPopular,
      isFeatured,
    } = req.body;

    if (!cityName || !countryId || !continent) {
      return ApiResponse.error(
        res,
        "City name, country ID, and continent are required",
        400
      );
    }

    const cityId = await Admin.addCity({
      cityName,
      countryId,
      continent,
      latitude,
      longitude,
      description,
      imageUrl,
      isPopular,
      isFeatured,
    });

    return ApiResponse.success(
      res,
      { cityId, cityName },
      "City added successfully",
      201
    );
  } catch (error) {
    console.error("Add city error:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return ApiResponse.error(res, "Country not found", 404);
    }
    return ApiResponse.error(res, "Failed to add city", 500);
  }
};

/**
 * Update city
 */
const updateCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { cityName, description, imageUrl, isPopular, isFeatured } = req.body;

    if (!cityName) {
      return ApiResponse.error(res, "City name is required", 400);
    }

    const result = await Admin.updateCity(cityId, {
      cityName,
      description,
      imageUrl,
      isPopular: isPopular ? 1 : 0,
      isFeatured: isFeatured ? 1 : 0,
    });

    if (result.affectedRows === 0) {
      return ApiResponse.error(res, "City not found", 404);
    }

    return ApiResponse.success(res, { cityId }, "City updated successfully");
  } catch (error) {
    console.error("Update city error:", error);
    return ApiResponse.error(res, "Failed to update city", 500);
  }
};

/**
 * Add new activity
 */
const addActivity = async (req, res) => {
  try {
    const {
      activityName,
      cityId,
      countryId,
      categoryId,
      description,
      durationHours,
      priceRange,
      imageUrl,
      isPopular,
    } = req.body;

    if (!activityName || !cityId || !countryId) {
      return ApiResponse.error(
        res,
        "Activity name, city ID, and country ID are required",
        400
      );
    }

    const activityId = await Admin.addActivity({
      activityName,
      cityId,
      countryId,
      categoryId,
      description,
      durationHours,
      priceRange,
      imageUrl,
      isPopular,
    });

    return ApiResponse.success(
      res,
      { activityId, activityName },
      "Activity added successfully",
      201
    );
  } catch (error) {
    console.error("Add activity error:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return ApiResponse.error(
        res,
        "City, country, or category not found",
        404
      );
    }
    return ApiResponse.error(res, "Failed to add activity", 500);
  }
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  getAllTrips,
  deleteTrip,
  getPlatformStatistics,
  addCity,
  updateCity,
  addActivity,
};
