/**
 * Notifications API Service
 */

import api from "./api";

/**
 * Get user notifications
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with notifications
 */
export const getNotifications = async (params = {}) => {
  const response = await api.get("/notifications", params);
  return response.data.notifications;
};

/**
 * Mark notification as read
 * @param {number} notificationId - Notification ID
 * @returns {Promise} API response
 */
export const markAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response;
};

/**
 * Mark all notifications as read
 * @returns {Promise} API response
 */
export const markAllAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response;
};

/**
 * Delete notification
 * @param {number} notificationId - Notification ID
 * @returns {Promise} API response
 */
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response;
};

/**
 * Get unread notification count
 * @returns {Promise} API response with count
 */
export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data.count;
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
