const { executeQuery } = require("../config/database");

class Trip {
  static async create(tripData) {
    const query = `
      INSERT INTO trips (
        user_id, trip_name, description, start_date, end_date,
        total_budget, currency, cover_image_url, is_public, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      tripData.userId,
      tripData.tripName,
      tripData.description || null,
      tripData.startDate,
      tripData.endDate,
      tripData.totalBudget || null,
      tripData.currency || "USD",
      tripData.coverImageUrl || null,
      tripData.isPublic || false,
      tripData.tags ? JSON.stringify(tripData.tags) : null,
    ];

    const result = await executeQuery(query, params);
    return result.insertId;
  }

  static async findById(tripId) {
    const query = "SELECT * FROM vw_trip_summary WHERE trip_id = ?";
    const results = await executeQuery(query, [tripId]);
    return results[0] || null;
  }

  static async getUserTrips(userId, filters = {}) {
    let query = `
      SELECT trip_id, trip_name, description, start_date, end_date, total_days,
             status, total_budget, currency, cover_image_url, is_public, 
             total_cities, total_activities, view_count, like_count, created_at
      FROM trips
      WHERE user_id = ?
    `;

    const params = [userId];

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    query += " ORDER BY created_at DESC";
    return await executeQuery(query, params);
  }

  static async getPublicTrips(filters = {}, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM vw_trip_summary
      WHERE is_public = TRUE
    `;

    const params = [];

    if (filters.search) {
      query += " AND (trip_name LIKE ? OR description LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const results = await executeQuery(query, params);

    const countQuery = "SELECT COUNT(*) as total FROM trips WHERE is_public = TRUE";
    const countResult = await executeQuery(countQuery);

    return {
      trips: results,
      pagination: { page, limit, total: countResult[0].total, totalPages: Math.ceil(countResult[0].total / limit) },
    };
  }

  static async update(tripId, userId, updateData) {
    const allowedFields = ["trip_name", "description", "start_date", "end_date", "total_budget", "currency", "cover_image_url", "is_public", "status", "tags"];
    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        params.push(key === "tags" && value ? JSON.stringify(value) : value);
      }
    }

    if (updates.length === 0) {
      throw new Error("No valid fields to update");
    }

    params.push(tripId, userId);
    const query = `UPDATE trips SET ${updates.join(", ")} WHERE trip_id = ? AND user_id = ?`;
    await executeQuery(query, params);
  }

  static async delete(tripId, userId) {
    const query = "DELETE FROM trips WHERE trip_id = ? AND user_id = ?";
    await executeQuery(query, [tripId, userId]);
  }

  static async incrementViewCount(tripId) {
    const query = "UPDATE trips SET view_count = view_count + 1 WHERE trip_id = ?";
    await executeQuery(query, [tripId]);
  }

  static async getByShareToken(shareToken) {
    const query = "SELECT * FROM vw_trip_summary WHERE share_token = ?";
    const results = await executeQuery(query, [shareToken]);
    return results[0] || null;
  }

  static async like(tripId, userId) {
    const query = "INSERT INTO trip_likes (trip_id, user_id) VALUES (?, ?)";
    await executeQuery(query, [tripId, userId]);
  }

  static async unlike(tripId, userId) {
    const query = "DELETE FROM trip_likes WHERE trip_id = ? AND user_id = ?";
    await executeQuery(query, [tripId, userId]);
  }

  static async hasUserLiked(tripId, userId) {
    const query = "SELECT COUNT(*) as count FROM trip_likes WHERE trip_id = ? AND user_id = ?";
    const results = await executeQuery(query, [tripId, userId]);
    return results[0].count > 0;
  }

  static async clone(originalTripId, newUserId) {
    const cloneQuery = "CALL sp_clone_trip(?, ?, @new_trip_id)";
    await executeQuery(cloneQuery, [originalTripId, newUserId]);
    
    const getIdQuery = "SELECT @new_trip_id as new_trip_id";
    const result = await executeQuery(getIdQuery);
    return result[0].new_trip_id;
  }
}

module.exports = Trip;
