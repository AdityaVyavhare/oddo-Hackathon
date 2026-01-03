const db = require("../config/database");

class Wishlist {
  /**
   * Add city to wishlist
   */
  static async addCity(userId, cityId) {
    const query = `
      INSERT INTO wishlist_cities (user_id, city_id)
      VALUES (?, ?)
    `;
    const [result] = await db.execute(query, [userId, cityId]);
    return result;
  }

  /**
   * Remove city from wishlist
   */
  static async removeCity(userId, cityId) {
    const query = `
      DELETE FROM wishlist_cities
      WHERE user_id = ? AND city_id = ?
    `;
    const [result] = await db.execute(query, [userId, cityId]);
    return result;
  }

  /**
   * Get user's wishlist cities
   */
  static async getCities(userId, filters = {}) {
    let query = `
      SELECT 
        wc.id,
        wc.added_at,
        c.city_id,
        c.city_name,
        c.country_id,
        co.country_name,
        c.continent,
        c.latitude,
        c.longitude,
        c.description,
        c.image_url,
        c.is_popular,
        c.is_featured,
        c.popularity_score
      FROM wishlist_cities wc
      JOIN cities c ON wc.city_id = c.city_id
      JOIN countries co ON c.country_id = co.country_id
      WHERE wc.user_id = ?
    `;

    const params = [userId];

    if (filters.continent) {
      query += ` AND c.continent = ?`;
      params.push(filters.continent);
    }

    query += ` ORDER BY wc.added_at DESC`;

    const [cities] = await db.execute(query, params);
    return cities;
  }

  /**
   * Add activity to wishlist
   */
  static async addActivity(userId, activityId) {
    const query = `
      INSERT INTO wishlist_activities (user_id, activity_id)
      VALUES (?, ?)
    `;
    const [result] = await db.execute(query, [userId, activityId]);
    return result;
  }

  /**
   * Remove activity from wishlist
   */
  static async removeActivity(userId, activityId) {
    const query = `
      DELETE FROM wishlist_activities
      WHERE user_id = ? AND activity_id = ?
    `;
    const [result] = await db.execute(query, [userId, activityId]);
    return result;
  }

  /**
   * Get user's wishlist activities
   */
  static async getActivities(userId, filters = {}) {
    let query = `
      SELECT 
        wa.id,
        wa.added_at,
        a.activity_id,
        a.activity_name,
        a.city_id,
        c.city_name,
        a.country_id,
        co.country_name,
        a.category_id,
        ac.category_name,
        a.description,
        a.duration_hours,
        a.price_range,
        a.image_url,
        a.average_rating,
        a.total_reviews,
        a.is_popular
      FROM wishlist_activities wa
      JOIN activities a ON wa.activity_id = a.activity_id
      JOIN cities c ON a.city_id = c.city_id
      JOIN countries co ON a.country_id = co.country_id
      LEFT JOIN activity_categories ac ON a.category_id = ac.category_id
      WHERE wa.user_id = ?
    `;

    const params = [userId];

    if (filters.cityId) {
      query += ` AND a.city_id = ?`;
      params.push(filters.cityId);
    }

    if (filters.categoryId) {
      query += ` AND a.category_id = ?`;
      params.push(filters.categoryId);
    }

    query += ` ORDER BY wa.added_at DESC`;

    const [activities] = await db.execute(query, params);
    return activities;
  }

  /**
   * Check if city is in wishlist
   */
  static async isCityInWishlist(userId, cityId) {
    const query = `
      SELECT COUNT(*) as count
      FROM wishlist_cities
      WHERE user_id = ? AND city_id = ?
    `;
    const [rows] = await db.execute(query, [userId, cityId]);
    return rows[0].count > 0;
  }

  /**
   * Check if activity is in wishlist
   */
  static async isActivityInWishlist(userId, activityId) {
    const query = `
      SELECT COUNT(*) as count
      FROM wishlist_activities
      WHERE user_id = ? AND activity_id = ?
    `;
    const [rows] = await db.execute(query, [userId, activityId]);
    return rows[0].count > 0;
  }

  /**
   * Get complete wishlist (cities and activities)
   */
  static async getCompleteWishlist(userId) {
    const cities = await this.getCities(userId);
    const activities = await this.getActivities(userId);

    return {
      cities,
      activities,
      totalCities: cities.length,
      totalActivities: activities.length,
    };
  }
}

module.exports = Wishlist;
