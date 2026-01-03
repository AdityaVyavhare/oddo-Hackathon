const db = require("../config/database");

class Search {
  /**
   * Global search across trips, cities, activities, and users
   */
  static async globalSearch(query, filters = {}) {
    const searchTerm = `%${query}%`;
    const limit = filters.limit || 10;

    const results = {
      trips: [],
      cities: [],
      activities: [],
      users: [],
    };

    // Search trips
    if (!filters.type || filters.type === "trips") {
      const tripQuery = `
        SELECT 
          trip_id,
          trip_name,
          description,
          cover_image,
          total_likes,
          view_count,
          is_public,
          'trip' as result_type
        FROM trips
        WHERE is_public = 1 
          AND (trip_name LIKE ? OR description LIKE ?)
        ORDER BY total_likes DESC, view_count DESC
        LIMIT ?
      `;
      const [trips] = await db.execute(tripQuery, [
        searchTerm,
        searchTerm,
        limit,
      ]);
      results.trips = trips;
    }

    // Search cities
    if (!filters.type || filters.type === "cities") {
      const cityQuery = `
        SELECT 
          city_id,
          city_name,
          country_id,
          continent,
          description,
          image_url,
          is_popular,
          popularity_score,
          'city' as result_type
        FROM cities
        WHERE city_name LIKE ? OR description LIKE ?
        ORDER BY popularity_score DESC, is_popular DESC
        LIMIT ?
      `;
      const [cities] = await db.execute(cityQuery, [
        searchTerm,
        searchTerm,
        limit,
      ]);
      results.cities = cities;
    }

    // Search activities
    if (!filters.type || filters.type === "activities") {
      const activityQuery = `
        SELECT 
          activity_id,
          activity_name,
          city_id,
          description,
          image_url,
          average_rating,
          total_reviews,
          is_popular,
          'activity' as result_type
        FROM activities
        WHERE activity_name LIKE ? OR description LIKE ?
        ORDER BY average_rating DESC, total_reviews DESC
        LIMIT ?
      `;
      const [activities] = await db.execute(activityQuery, [
        searchTerm,
        searchTerm,
        limit,
      ]);
      results.activities = activities;
    }

    // Search users
    if (!filters.type || filters.type === "users") {
      const userQuery = `
        SELECT 
          user_id,
          username,
          full_name,
          bio,
          profile_picture,
          'user' as result_type
        FROM users
        WHERE is_active = 1 
          AND (username LIKE ? OR full_name LIKE ? OR bio LIKE ?)
        LIMIT ?
      `;
      const [users] = await db.execute(userQuery, [
        searchTerm,
        searchTerm,
        searchTerm,
        limit,
      ]);
      results.users = users;
    }

    return results;
  }

  /**
   * Search trips only
   */
  static async searchTrips(query, filters = {}) {
    const searchTerm = `%${query}%`;
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    let sql = `
      SELECT 
        t.trip_id,
        t.trip_name,
        t.description,
        t.cover_image,
        t.total_likes,
        t.view_count,
        t.created_at,
        u.user_id,
        u.username,
        u.full_name,
        u.profile_picture
      FROM trips t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.is_public = 1 
        AND (t.trip_name LIKE ? OR t.description LIKE ?)
    `;

    const params = [searchTerm, searchTerm];

    if (filters.minLikes) {
      sql += ` AND t.total_likes >= ?`;
      params.push(filters.minLikes);
    }

    sql += ` ORDER BY t.total_likes DESC, t.view_count DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [trips] = await db.execute(sql, params);
    return trips;
  }

  /**
   * Search users only
   */
  static async searchUsers(query, filters = {}) {
    const searchTerm = `%${query}%`;
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    const sql = `
      SELECT 
        u.user_id,
        u.username,
        u.full_name,
        u.bio,
        u.profile_picture,
        (SELECT COUNT(*) FROM user_follows WHERE following_id = u.user_id) as followers_count,
        (SELECT COUNT(*) FROM trips WHERE user_id = u.user_id AND is_public = 1) as public_trips_count
      FROM users u
      WHERE u.is_active = 1 
        AND (u.username LIKE ? OR u.full_name LIKE ? OR u.bio LIKE ?)
      ORDER BY followers_count DESC, public_trips_count DESC
      LIMIT ? OFFSET ?
    `;

    const [users] = await db.execute(sql, [
      searchTerm,
      searchTerm,
      searchTerm,
      limit,
      offset,
    ]);
    return users;
  }

  /**
   * Get recommended trips for user based on preferences and wishlist
   */
  static async getRecommendedTrips(userId, filters = {}) {
    const limit = filters.limit || 20;

    const query = `
      SELECT DISTINCT
        t.trip_id,
        t.trip_name,
        t.description,
        t.cover_image,
        t.total_likes,
        t.view_count,
        u.user_id,
        u.username,
        u.full_name,
        'recommendation' as source
      FROM trips t
      JOIN users u ON t.user_id = u.user_id
      JOIN trip_stops ts ON t.trip_id = ts.trip_id
      WHERE t.is_public = 1
        AND t.user_id != ?
        AND (
          -- Trips with cities in user's wishlist
          ts.city_id IN (SELECT city_id FROM wishlist_cities WHERE user_id = ?)
          
          -- Trips liked by users that current user follows
          OR t.trip_id IN (
            SELECT trip_id FROM trip_likes 
            WHERE user_id IN (SELECT following_id FROM user_follows WHERE follower_id = ?)
          )
        )
      ORDER BY t.total_likes DESC, t.view_count DESC
      LIMIT ?
    `;

    const [trips] = await db.execute(query, [userId, userId, userId, limit]);
    return trips;
  }

  /**
   * Get recommended activities for a city
   */
  static async getRecommendedActivities(cityId, userId = null, limit = 10) {
    let query = `
      SELECT 
        a.activity_id,
        a.activity_name,
        a.description,
        a.image_url,
        a.average_rating,
        a.total_reviews,
        a.price_range,
        a.duration_hours,
        ac.category_name
      FROM activities a
      LEFT JOIN activity_categories ac ON a.category_id = ac.category_id
      WHERE a.city_id = ?
    `;

    const params = [cityId];

    // If user provided, prioritize categories from user preferences
    if (userId) {
      query = `
        SELECT 
          a.activity_id,
          a.activity_name,
          a.description,
          a.image_url,
          a.average_rating,
          a.total_reviews,
          a.price_range,
          a.duration_hours,
          ac.category_name,
          CASE 
            WHEN ac.category_name IN (
              SELECT travel_style FROM user_preferences WHERE user_id = ?
            ) THEN 1 
            ELSE 0 
          END as matches_preference
        FROM activities a
        LEFT JOIN activity_categories ac ON a.category_id = ac.category_id
        WHERE a.city_id = ?
        ORDER BY matches_preference DESC, a.average_rating DESC, a.total_reviews DESC
        LIMIT ?
      `;
      params.unshift(userId);
      params.push(limit);
    } else {
      query += ` ORDER BY a.average_rating DESC, a.total_reviews DESC LIMIT ?`;
      params.push(limit);
    }

    const [activities] = await db.execute(query, params);
    return activities;
  }

  /**
   * Get trending destinations
   */
  static async getTrendingDestinations(limit = 10, timeframe = 30) {
    const query = `
      SELECT 
        c.city_id,
        c.city_name,
        c.country_id,
        co.country_name,
        c.continent,
        c.image_url,
        c.description,
        c.popularity_score,
        COUNT(DISTINCT ts.trip_id) as recent_trip_count,
        COUNT(DISTINCT wc.user_id) as wishlist_count
      FROM cities c
      JOIN countries co ON c.country_id = co.country_id
      LEFT JOIN trip_stops ts ON c.city_id = ts.city_id
      LEFT JOIN trips t ON ts.trip_id = t.trip_id 
        AND t.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      LEFT JOIN wishlist_cities wc ON c.city_id = wc.city_id
        AND wc.added_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY c.city_id
      ORDER BY recent_trip_count DESC, wishlist_count DESC, c.popularity_score DESC
      LIMIT ?
    `;

    const [destinations] = await db.execute(query, [
      timeframe,
      timeframe,
      limit,
    ]);
    return destinations;
  }
}

module.exports = Search;
