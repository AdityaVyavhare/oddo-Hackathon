const Wishlist = require("../models/Wishlist");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Get user's complete wishlist
 */
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type } = req.query; // 'cities', 'activities', or 'all'

    if (type === "cities") {
      const cities = await Wishlist.getCities(userId, req.query);
      return ApiResponse.success(
        res,
        cities,
        "Wishlist cities retrieved successfully"
      );
    }

    if (type === "activities") {
      const activities = await Wishlist.getActivities(userId, req.query);
      return ApiResponse.success(
        res,
        activities,
        "Wishlist activities retrieved successfully"
      );
    }

    // Default: return complete wishlist
    const wishlist = await Wishlist.getCompleteWishlist(userId);
    return ApiResponse.success(
      res,
      wishlist,
      "Wishlist retrieved successfully"
    );
  } catch (error) {
    console.error("Get wishlist error:", error);
    return ApiResponse.error(res, "Failed to retrieve wishlist", 500);
  }
};

/**
 * Add city to wishlist
 */
const addCityToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cityId } = req.params;

    // Check if already in wishlist
    const isInWishlist = await Wishlist.isCityInWishlist(userId, cityId);
    if (isInWishlist) {
      return ApiResponse.error(res, "City is already in your wishlist", 400);
    }

    await Wishlist.addCity(userId, cityId);
    return ApiResponse.success(res, { cityId }, "City added to wishlist", 201);
  } catch (error) {
    console.error("Add city to wishlist error:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return ApiResponse.error(res, "City not found", 404);
    }
    return ApiResponse.error(res, "Failed to add city to wishlist", 500);
  }
};

/**
 * Remove city from wishlist
 */
const removeCityFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cityId } = req.params;

    const result = await Wishlist.removeCity(userId, cityId);

    if (result.affectedRows === 0) {
      return ApiResponse.error(res, "City not found in wishlist", 404);
    }

    return ApiResponse.success(res, null, "City removed from wishlist");
  } catch (error) {
    console.error("Remove city from wishlist error:", error);
    return ApiResponse.error(res, "Failed to remove city from wishlist", 500);
  }
};

/**
 * Add activity to wishlist
 */
const addActivityToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { activityId } = req.params;

    // Check if already in wishlist
    const isInWishlist = await Wishlist.isActivityInWishlist(
      userId,
      activityId
    );
    if (isInWishlist) {
      return ApiResponse.error(
        res,
        "Activity is already in your wishlist",
        400
      );
    }

    await Wishlist.addActivity(userId, activityId);
    return ApiResponse.success(
      res,
      { activityId },
      "Activity added to wishlist",
      201
    );
  } catch (error) {
    console.error("Add activity to wishlist error:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return ApiResponse.error(res, "Activity not found", 404);
    }
    return ApiResponse.error(res, "Failed to add activity to wishlist", 500);
  }
};

/**
 * Remove activity from wishlist
 */
const removeActivityFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { activityId } = req.params;

    const result = await Wishlist.removeActivity(userId, activityId);

    if (result.affectedRows === 0) {
      return ApiResponse.error(res, "Activity not found in wishlist", 404);
    }

    return ApiResponse.success(res, null, "Activity removed from wishlist");
  } catch (error) {
    console.error("Remove activity from wishlist error:", error);
    return ApiResponse.error(
      res,
      "Failed to remove activity from wishlist",
      500
    );
  }
};

/**
 * Check if item is in wishlist
 */
const checkWishlistItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, id } = req.params; // type: 'city' or 'activity'

    let isInWishlist;

    if (type === "city") {
      isInWishlist = await Wishlist.isCityInWishlist(userId, id);
    } else if (type === "activity") {
      isInWishlist = await Wishlist.isActivityInWishlist(userId, id);
    } else {
      return ApiResponse.error(
        res,
        "Invalid type. Use 'city' or 'activity'",
        400
      );
    }

    return ApiResponse.success(
      res,
      { isInWishlist, type, id },
      "Wishlist status checked"
    );
  } catch (error) {
    console.error("Check wishlist item error:", error);
    return ApiResponse.error(res, "Failed to check wishlist status", 500);
  }
};

module.exports = {
  getWishlist,
  addCityToWishlist,
  removeCityFromWishlist,
  addActivityToWishlist,
  removeActivityFromWishlist,
  checkWishlistItem,
};
