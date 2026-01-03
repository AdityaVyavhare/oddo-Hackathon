const db = require("../config/database");

class Admin {
  /**
   * Get all users with pagination and filters
   */
  static async getAllUsers(filters = {}) {
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    let query = `
      SELECT 
        user_id,
        username,
        email,
        full_name,
        profile_picture,
        role,
        is_active,
        created_at,
        last_login,
        (SELECT COUNT(*) FROM trips WHERE user_id = users.user_id) as total_trips,
        (SELECT COUNT(*) FROM user_follows WHERE following_id = users.user_id) as followers_count
      FROM users
      WHERE 1=1
    `;

    const params = [];

    if (filters.isActive !== undefined) {
      query += ` AND is_active = ?`;
      params.push(filters.isActive);
    }

    if (filters.role) {
      query += ` AND role = ?`;
      params.push(filters.role);
    }

    if (filters.search) {
      query += ` AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [users] = await db.execute(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
    const countParams = [];

    if (filters.isActive !== undefined) {
      countQuery += ` AND is_active = ?`;
      countParams.push(filters.isActive);
    }

    if (filters.role) {
      countQuery += ` AND role = ?`;
      countParams.push(filters.role);
    }

    if (filters.search) {
      countQuery += ` AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await db.execute(countQuery, countParams);

    return {
      users,
      total: countResult[0].total,
      limit,
      offset,
    };
  }

  /**
   * Update user status (activate/deactivate)
   */
  static async updateUserStatus(userId, isActive) {
    const query = `UPDATE users SET is_active = ? WHERE user_id = ?`;
    const [result] = await db.execute(query, [isActive, userId]);
    return result;
  }

  /**
   * Get all trips with pagination and filters
   */
  static async getAllTrips(filters = {}) {
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    let query = `
      SELECT 
        t.trip_id,
        t.trip_name,
        t.description,
        t.cover_image,
        t.is_public,
        t.total_likes,
        t.view_count,
        t.created_at,
        u.user_id,
        u.username,
        u.full_name
      FROM trips t
      JOIN users u ON t.user_id = u.user_id
      WHERE 1=1
    `;

    const params = [];

    if (filters.isPublic !== undefined) {
      query += ` AND t.is_public = ?`;
      params.push(filters.isPublic);
    }

    if (filters.userId) {
      query += ` AND t.user_id = ?`;
      params.push(filters.userId);
    }

    query += ` ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [trips] = await db.execute(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM trips WHERE 1=1`;
    const countParams = [];

    if (filters.isPublic !== undefined) {
      countQuery += ` AND is_public = ?`;
      countParams.push(filters.isPublic);
    }

    if (filters.userId) {
      countQuery += ` AND user_id = ?`;
      countParams.push(filters.userId);
    }

    const [countResult] = await db.execute(countQuery, countParams);

    return {
      trips,
      total: countResult[0].total,
      limit,
      offset,
    };
  }

  /**
   * Delete trip (admin override)
   */
  static async deleteTrip(tripId) {
    const query = `DELETE FROM trips WHERE trip_id = ?`;
    const [result] = await db.execute(query, [tripId]);
    return result;
  }

  /**
   * Get platform statistics
   */
  static async getPlatformStatistics() {
    const queries = {
      totalUsers: `SELECT COUNT(*) as count FROM users WHERE is_active = 1`,
      totalTrips: `SELECT COUNT(*) as count FROM trips`,
      totalPublicTrips: `SELECT COUNT(*) as count FROM trips WHERE is_public = 1`,
      totalActivities: `SELECT COUNT(*) as count FROM activities`,
      totalCities: `SELECT COUNT(*) as count FROM cities`,
      newUsersThisMonth: `SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`,
      newTripsThisMonth: `SELECT COUNT(*) as count FROM trips WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`,
    };

    const stats = {};

    for (const [key, query] of Object.entries(queries)) {
      const [result] = await db.execute(query);
      stats[key] = result[0].count;
    }

    // Get most popular destinations
    const [popularDestinations] = await db.execute(`
      SELECT 
        c.city_name,
        co.country_name,
        COUNT(DISTINCT ts.trip_id) as trip_count
      FROM trip_stops ts
      JOIN cities c ON ts.city_id = c.city_id
      JOIN countries co ON c.country_id = co.country_id
      GROUP BY c.city_id
      ORDER BY trip_count DESC
      LIMIT 5
    `);

    stats.popularDestinations = popularDestinations;

    // Get top users by followers
    const [topUsers] = await db.execute(`
      SELECT 
        u.username,
        u.full_name,
        COUNT(uf.follower_id) as followers_count
      FROM users u
      LEFT JOIN user_follows uf ON u.user_id = uf.following_id
      WHERE u.is_active = 1
      GROUP BY u.user_id
      ORDER BY followers_count DESC
      LIMIT 5
    `);

    stats.topUsers = topUsers;

    return stats;
  }

  /**
   * Add new city
   */
  static async addCity(cityData) {
    const query = `
      INSERT INTO cities (city_name, country_id, continent, latitude, longitude, description, image_url, is_popular, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      cityData.cityName,
      cityData.countryId,
      cityData.continent,
      cityData.latitude,
      cityData.longitude,
      cityData.description,
      cityData.imageUrl,
      cityData.isPopular || 0,
      cityData.isFeatured || 0,
    ]);
    return result.insertId;
  }

  /**
   * Update city
   */
  static async updateCity(cityId, cityData) {
    const query = `
      UPDATE cities
      SET city_name = ?, description = ?, image_url = ?, is_popular = ?, is_featured = ?
      WHERE city_id = ?
    `;
    const [result] = await db.execute(query, [
      cityData.cityName,
      cityData.description,
      cityData.imageUrl,
      cityData.isPopular,
      cityData.isFeatured,
      cityId,
    ]);
    return result;
  }

  /**
   * Add new activity
   */
  static async addActivity(activityData) {
    const query = `
      INSERT INTO activities (activity_name, city_id, country_id, category_id, description, duration_hours, price_range, image_url, is_popular)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      activityData.activityName,
      activityData.cityId,
      activityData.countryId,
      activityData.categoryId,
      activityData.description,
      activityData.durationHours,
      activityData.priceRange,
      activityData.imageUrl,
      activityData.isPopular || 0,
    ]);
    return result.insertId;
  }
}

module.exports = Admin;
