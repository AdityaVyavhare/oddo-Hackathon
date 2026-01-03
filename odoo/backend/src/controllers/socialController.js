const Social = require("../models/Social");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Follow a user
 */
const followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { userId } = req.params;

    // Cannot follow yourself
    if (followerId === parseInt(userId)) {
      return ApiResponse.error(res, "You cannot follow yourself", 400);
    }

    // Check if already following
    const isFollowing = await Social.isFollowing(followerId, userId);
    if (isFollowing) {
      return ApiResponse.error(res, "You are already following this user", 400);
    }

    await Social.followUser(followerId, userId);
    return ApiResponse.success(
      res,
      { userId },
      "User followed successfully",
      201
    );
  } catch (error) {
    console.error("Follow user error:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return ApiResponse.error(res, "User not found", 404);
    }
    return ApiResponse.error(res, "Failed to follow user", 500);
  }
};

/**
 * Unfollow a user
 */
const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { userId } = req.params;

    const result = await Social.unfollowUser(followerId, userId);

    if (result.affectedRows === 0) {
      return ApiResponse.error(res, "You are not following this user", 404);
    }

    return ApiResponse.success(res, null, "User unfollowed successfully");
  } catch (error) {
    console.error("Unfollow user error:", error);
    return ApiResponse.error(res, "Failed to unfollow user", 500);
  }
};

/**
 * Get user's followers
 */
const getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const pagination = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
    };

    const result = await Social.getFollowers(userId, pagination);
    return ApiResponse.success(res, result, "Followers retrieved successfully");
  } catch (error) {
    console.error("Get followers error:", error);
    return ApiResponse.error(res, "Failed to retrieve followers", 500);
  }
};

/**
 * Get users that the user is following
 */
const getUserFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const pagination = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
    };

    const result = await Social.getFollowing(userId, pagination);
    return ApiResponse.success(
      res,
      result,
      "Following list retrieved successfully"
    );
  } catch (error) {
    console.error("Get following error:", error);
    return ApiResponse.error(res, "Failed to retrieve following list", 500);
  }
};

/**
 * Get activity feed
 */
const getActivityFeed = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pagination = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
    };

    const activities = await Social.getActivityFeed(userId, pagination);
    return ApiResponse.success(
      res,
      activities,
      "Activity feed retrieved successfully"
    );
  } catch (error) {
    console.error("Get activity feed error:", error);
    return ApiResponse.error(res, "Failed to retrieve activity feed", 500);
  }
};

/**
 * Get trip comments
 */
const getTripComments = async (req, res) => {
  try {
    const { tripId } = req.params;
    const pagination = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
    };

    const result = await Social.getTripComments(tripId, pagination);
    return ApiResponse.success(res, result, "Comments retrieved successfully");
  } catch (error) {
    console.error("Get trip comments error:", error);
    return ApiResponse.error(res, "Failed to retrieve comments", 500);
  }
};

/**
 * Add trip comment
 */
const addTripComment = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      return ApiResponse.error(res, "Comment cannot be empty", 400);
    }

    if (comment.length > 1000) {
      return ApiResponse.error(
        res,
        "Comment cannot exceed 1000 characters",
        400
      );
    }

    const commentId = await Social.addTripComment(tripId, userId, comment);
    return ApiResponse.success(
      res,
      { commentId, tripId, comment },
      "Comment added successfully",
      201
    );
  } catch (error) {
    console.error("Add trip comment error:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return ApiResponse.error(res, "Trip not found", 404);
    }
    return ApiResponse.error(res, "Failed to add comment", 500);
  }
};

/**
 * Delete trip comment
 */
const deleteTripComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    // Check if comment exists and belongs to user
    const comment = await Social.getCommentById(commentId);
    if (!comment) {
      return ApiResponse.error(res, "Comment not found", 404);
    }

    if (comment.user_id !== userId) {
      return ApiResponse.error(
        res,
        "You can only delete your own comments",
        403
      );
    }

    await Social.deleteTripComment(commentId, userId);
    return ApiResponse.success(res, null, "Comment deleted successfully");
  } catch (error) {
    console.error("Delete trip comment error:", error);
    return ApiResponse.error(res, "Failed to delete comment", 500);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
  getActivityFeed,
  getTripComments,
  addTripComment,
  deleteTripComment,
};
