const Notification = require("../models/Notification");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Get user notifications
 */
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const filters = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
      isRead: req.query.isRead, // 'true', 'false', or undefined
    };

    const result = await Notification.getUserNotifications(userId, filters);
    return ApiResponse.success(
      res,
      result,
      "Notifications retrieved successfully"
    );
  } catch (error) {
    console.error("Get notifications error:", error);
    return ApiResponse.error(res, "Failed to retrieve notifications", 500);
  }
};

/**
 * Mark notification as read
 */
const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    // Verify notification belongs to user
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return ApiResponse.error(res, "Notification not found", 404);
    }

    if (notification.user_id !== userId) {
      return ApiResponse.error(res, "Access denied", 403);
    }

    await Notification.markAsRead(notificationId, userId);
    return ApiResponse.success(res, null, "Notification marked as read");
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return ApiResponse.error(res, "Failed to mark notification as read", 500);
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await Notification.markAllAsRead(userId);
    return ApiResponse.success(
      res,
      { updatedCount: result.affectedRows },
      "All notifications marked as read"
    );
  } catch (error) {
    console.error("Mark all as read error:", error);
    return ApiResponse.error(
      res,
      "Failed to mark all notifications as read",
      500
    );
  }
};

/**
 * Delete notification
 */
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    // Verify notification belongs to user
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return ApiResponse.error(res, "Notification not found", 404);
    }

    if (notification.user_id !== userId) {
      return ApiResponse.error(res, "Access denied", 403);
    }

    await Notification.delete(notificationId, userId);
    return ApiResponse.success(res, null, "Notification deleted successfully");
  } catch (error) {
    console.error("Delete notification error:", error);
    return ApiResponse.error(res, "Failed to delete notification", 500);
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
};
