const db = require("../config/database");

class Social {
  /**
   * Follow a user
   */
  static async followUser(followerId, followingId) {
    const query = `
      INSERT INTO user_follows (follower_id, following_id)
      VALUES (?, ?)
    `;
    const [result] = await db.execute(query, [followerId, followingId]);
    return result;
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(followerId, followingId) {
    const query = `
      DELETE FROM user_follows
      WHERE follower_id = ? AND following_id = ?
    `;
    const [result] = await db.execute(query, [followerId, followingId]);
    return result;
  }

  /**
   * Check if user is following another user
   */
  static async isFollowing(followerId, followingId) {
    const query = `
      SELECT COUNT(*) as count
      FROM user_follows
      WHERE follower_id = ? AND following_id = ?
    `;
    const [rows] = await db.execute(query, [followerId, followingId]);
    return rows[0].count > 0;
  }

  /**
   * Get user's followers
   */
  static async getFollowers(userId, pagination = {}) {
    const limit = pagination.limit || 20;
    const offset = pagination.offset || 0;

    const query = `
      SELECT 
        u.user_id,
        u.username,
        u.full_name,
        u.profile_picture,
        u.bio,
        uf.followed_at,
        (SELECT COUNT(*) FROM user_follows WHERE follower_id = u.user_id) as following_count,
        (SELECT COUNT(*) FROM user_follows WHERE following_id = u.user_id) as followers_count,
        (SELECT COUNT(*) FROM trips WHERE user_id = u.user_id AND is_public = 1) as public_trips_count
      FROM user_follows uf
      JOIN users u ON uf.follower_id = u.user_id
      WHERE uf.following_id = ? AND u.is_active = 1
      ORDER BY uf.followed_at DESC
      LIMIT ? OFFSET ?
    `;

    const [followers] = await db.execute(query, [userId, limit, offset]);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM user_follows uf
      JOIN users u ON uf.follower_id = u.user_id
      WHERE uf.following_id = ? AND u.is_active = 1
    `;
    const [countResult] = await db.execute(countQuery, [userId]);

    return {
      followers,
      total: countResult[0].total,
      limit,
      offset,
    };
  }

  /**
   * Get users that a user is following
   */
  static async getFollowing(userId, pagination = {}) {
    const limit = pagination.limit || 20;
    const offset = pagination.offset || 0;

    const query = `
      SELECT 
        u.user_id,
        u.username,
        u.full_name,
        u.profile_picture,
        u.bio,
        uf.followed_at,
        (SELECT COUNT(*) FROM user_follows WHERE follower_id = u.user_id) as following_count,
        (SELECT COUNT(*) FROM user_follows WHERE following_id = u.user_id) as followers_count,
        (SELECT COUNT(*) FROM trips WHERE user_id = u.user_id AND is_public = 1) as public_trips_count
      FROM user_follows uf
      JOIN users u ON uf.following_id = u.user_id
      WHERE uf.follower_id = ? AND u.is_active = 1
      ORDER BY uf.followed_at DESC
      LIMIT ? OFFSET ?
    `;

    const [following] = await db.execute(query, [userId, limit, offset]);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM user_follows uf
      JOIN users u ON uf.following_id = u.user_id
      WHERE uf.follower_id = ? AND u.is_active = 1
    `;
    const [countResult] = await db.execute(countQuery, [userId]);

    return {
      following,
      total: countResult[0].total,
      limit,
      offset,
    };
  }

  /**
   * Get activity feed for user (following users' activities)
   */
  static async getActivityFeed(userId, pagination = {}) {
    const limit = pagination.limit || 20;
    const offset = pagination.offset || 0;

    const query = `
      SELECT 
        'trip_created' as activity_type,
        t.trip_id as item_id,
        t.trip_name as title,
        t.description,
        t.cover_image as image_url,
        t.created_at,
        u.user_id,
        u.username,
        u.full_name,
        u.profile_picture,
        t.total_likes,
        t.view_count
      FROM trips t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.user_id IN (SELECT following_id FROM user_follows WHERE follower_id = ?)
        AND t.is_public = 1
      
      UNION ALL
      
      SELECT 
        'trip_liked' as activity_type,
        t.trip_id as item_id,
        t.trip_name as title,
        t.description,
        t.cover_image as image_url,
        tl.liked_at as created_at,
        u.user_id,
        u.username,
        u.full_name,
        u.profile_picture,
        t.total_likes,
        t.view_count
      FROM trip_likes tl
      JOIN trips t ON tl.trip_id = t.trip_id
      JOIN users u ON tl.user_id = u.user_id
      WHERE tl.user_id IN (SELECT following_id FROM user_follows WHERE follower_id = ?)
        AND t.is_public = 1
      
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [activities] = await db.execute(query, [
      userId,
      userId,
      limit,
      offset,
    ]);
    return activities;
  }

  /**
   * Add comment to trip
   */
  static async addTripComment(tripId, userId, comment) {
    const query = `
      INSERT INTO trip_comments (trip_id, user_id, comment)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(query, [tripId, userId, comment]);
    return result.insertId;
  }

  /**
   * Get trip comments
   */
  static async getTripComments(tripId, pagination = {}) {
    const limit = pagination.limit || 20;
    const offset = pagination.offset || 0;

    const query = `
      SELECT 
        tc.comment_id,
        tc.comment,
        tc.created_at,
        tc.updated_at,
        u.user_id,
        u.username,
        u.full_name,
        u.profile_picture
      FROM trip_comments tc
      JOIN users u ON tc.user_id = u.user_id
      WHERE tc.trip_id = ?
      ORDER BY tc.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [comments] = await db.execute(query, [tripId, limit, offset]);

    const countQuery = `SELECT COUNT(*) as total FROM trip_comments WHERE trip_id = ?`;
    const [countResult] = await db.execute(countQuery, [tripId]);

    return {
      comments,
      total: countResult[0].total,
      limit,
      offset,
    };
  }

  /**
   * Delete trip comment
   */
  static async deleteTripComment(commentId, userId) {
    const query = `
      DELETE FROM trip_comments
      WHERE comment_id = ? AND user_id = ?
    `;
    const [result] = await db.execute(query, [commentId, userId]);
    return result;
  }

  /**
   * Get comment by ID
   */
  static async getCommentById(commentId) {
    const query = `
      SELECT * FROM trip_comments WHERE comment_id = ?
    `;
    const [rows] = await db.execute(query, [commentId]);
    return rows[0];
  }
}

module.exports = Social;
