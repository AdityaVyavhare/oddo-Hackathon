const { Activity, ActivityCategory, ActivityReview } = require("../models/Activity");
const ApiResponse = require("../utils/ApiResponse");

// Activity Controllers
const getAllActivities = async (req, res) => {
  try {
    const { page, limit, cityId, categoryId, search, minRating, maxCost, difficultyLevel, isFeatured, sortBy, sortOrder } = req.query;

    const filters = {};
    if (cityId) filters.cityId = parseInt(cityId);
    if (categoryId) filters.categoryId = parseInt(categoryId);
    if (search) filters.search = search;
    if (minRating) filters.minRating = parseFloat(minRating);
    if (maxCost) filters.maxCost = parseFloat(maxCost);
    if (difficultyLevel) filters.difficultyLevel = difficultyLevel;
    if (isFeatured !== undefined) filters.isFeatured = isFeatured === "true";
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;

    const pagination = {};
    if (page) pagination.page = parseInt(page);
    if (limit) pagination.limit = parseInt(limit);

    const result = await Activity.getAll(filters, pagination);
    return ApiResponse.success(res, 200, "Activities retrieved successfully", result);
  } catch (error) {
    console.error("Get activities error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve activities");
  }
};

const getActivityById = async (req, res) => {
  try {
    const { activityId } = req.params;
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return ApiResponse.notFound(res, "Activity not found");
    }

    await Activity.incrementPopularity(activityId);
    return ApiResponse.success(res, 200, "Activity retrieved successfully", activity);
  } catch (error) {
    console.error("Get activity error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve activity");
  }
};

const getActivitiesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit) : 20;

    const activities = await Activity.getByCity(cityId, limitNum);
    return ApiResponse.success(res, 200, "Activities retrieved successfully", { activities, count: activities.length });
  } catch (error) {
    console.error("Get activities by city error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve activities");
  }
};

// Category Controllers
const getAllCategories = async (req, res) => {
  try {
    const categories = await ActivityCategory.getAll();
    return ApiResponse.success(res, 200, "Categories retrieved successfully", { categories, count: categories.length });
  } catch (error) {
    console.error("Get categories error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve categories");
  }
};

// Review Controllers
const getActivityReviews = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { page, limit } = req.query;

    const pagination = {};
    if (page) pagination.page = parseInt(page);
    if (limit) pagination.limit = parseInt(limit);

    const result = await ActivityReview.getByActivity(activityId, pagination);
    return ApiResponse.success(res, 200, "Reviews retrieved successfully", result);
  } catch (error) {
    console.error("Get reviews error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve reviews");
  }
};

const createActivityReview = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.userId;
    const { rating, reviewTitle, reviewText, photos, visitDate } = req.body;

    const hasReviewed = await ActivityReview.hasUserReviewed(activityId, userId);
    if (hasReviewed) {
      return ApiResponse.conflict(res, "You have already reviewed this activity");
    }

    const reviewData = { activityId, userId, rating, reviewTitle, reviewText, photos, visitDate };
    const reviewId = await ActivityReview.create(reviewData);

    return ApiResponse.success(res, 201, "Review created successfully", { reviewId });
  } catch (error) {
    console.error("Create review error:", error);
    return ApiResponse.serverError(res, "Failed to create review");
  }
};

const updateActivityReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    const { rating, reviewTitle, reviewText, photos } = req.body;

    await ActivityReview.update(reviewId, userId, { rating, reviewTitle, reviewText, photos });
    return ApiResponse.success(res, 200, "Review updated successfully");
  } catch (error) {
    console.error("Update review error:", error);
    return ApiResponse.serverError(res, "Failed to update review");
  }
};

const deleteActivityReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    await ActivityReview.delete(reviewId, userId);
    return ApiResponse.success(res, 200, "Review deleted successfully");
  } catch (error) {
    console.error("Delete review error:", error);
    return ApiResponse.serverError(res, "Failed to delete review");
  }
};

const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    await ActivityReview.markHelpful(reviewId);
    return ApiResponse.success(res, 200, "Review marked as helpful");
  } catch (error) {
    console.error("Mark helpful error:", error);
    return ApiResponse.serverError(res, "Failed to mark review as helpful");
  }
};

module.exports = {
  getAllActivities,
  getActivityById,
  getActivitiesByCity,
  getAllCategories,
  getActivityReviews,
  createActivityReview,
  updateActivityReview,
  deleteActivityReview,
  markReviewHelpful,
};
