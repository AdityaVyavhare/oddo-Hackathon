const db = require("../config/database");

class Notification {
  /**
   * Create notification
   */
  static async create(
    userId,
    type,
    title,
    message,
    relatedId = null,
    relatedType = null
  ) {
    const query = `
      INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      userId,
      type,
      title,
      message,
      relatedId,
      relatedType,
    ]);
    return result.insertId;
  }

  /**
   * Get user notifications
   */
  static async getUserNotifications(userId, filters = {}) {
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    const isRead = filters.isRead; // undefined, 'true', 'false'

    let query = `
      SELECT 
        notification_id,
        type,
        title,
        message,
        related_id,
        related_type,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = ?
    `;

    const params = [userId];

    if (isRead === "true") {
      query += ` AND is_read = 1`;
    } else if (isRead === "false") {
      query += ` AND is_read = 0`;
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [notifications] = await db.execute(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM notifications WHERE user_id = ?`;
    const countParams = [userId];

    if (isRead === "true") {
      countQuery += ` AND is_read = 1`;
    } else if (isRead === "false") {
      countQuery += ` AND is_read = 0`;
    }

    const [countResult] = await db.execute(countQuery, countParams);

    // Get unread count
    const [unreadResult] = await db.execute(
      `SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = 0`,
      [userId]
    );

    return {
      notifications,
      total: countResult[0].total,
      unreadCount: unreadResult[0].unread,
      limit,
      offset,
    };
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    const query = `
      UPDATE notifications
      SET is_read = 1
      WHERE notification_id = ? AND user_id = ?
    `;
    const [result] = await db.execute(query, [notificationId, userId]);
    return result;
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId) {
    const query = `
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ? AND is_read = 0
    `;
    const [result] = await db.execute(query, [userId]);
    return result;
  }

  /**
   * Delete notification
   */
  static async delete(notificationId, userId) {
    const query = `
      DELETE FROM notifications
      WHERE notification_id = ? AND user_id = ?
    `;
    const [result] = await db.execute(query, [notificationId, userId]);
    return result;
  }

  /**
   * Get notification by ID
   */
  static async findById(notificationId) {
    const query = `SELECT * FROM notifications WHERE notification_id = ?`;
    const [rows] = await db.execute(query, [notificationId]);
    return rows[0];
  }

  /**
   * Delete old read notifications (cleanup)
   */
  static async deleteOldReadNotifications(userId, daysOld = 30) {
    const query = `
      DELETE FROM notifications
      WHERE user_id = ? 
        AND is_read = 1 
        AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
    `;
    const [result] = await db.execute(query, [userId, daysOld]);
    return result;
  }
}

module.exports = Notification;
