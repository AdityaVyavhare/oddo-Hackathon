const { executeQuery } = require("../config/database");

class Activity {
  // Get all activities with filters
  static async getAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.activity_id,
        a.city_id,
        c.city_name,
        co.country_name,
        a.category_id,
        ac.category_name,
        a.activity_name,
        a.description,
        a.estimated_duration_minutes,
        a.estimated_cost,
        a.currency,
        a.difficulty_level,
        a.age_restriction,
        a.address,
        a.latitude,
        a.longitude,
        a.contact_info,
        a.website_url,
        a.booking_required,
        a.booking_url,
        a.operating_hours,
        a.best_season,
        a.image_url,
        a.average_rating,
        a.total_reviews,
        a.popularity_count,
        a.is_featured
      FROM activities a
      JOIN cities c ON a.city_id = c.city_id
      JOIN countries co ON c.country_id = co.country_id
      JOIN activity_categories ac ON a.category_id = ac.category_id
      WHERE 1=1
    `;

    const params = [];

    if (filters.cityId) {
      query += " AND a.city_id = ?";
      params.push(filters.cityId);
    }

    if (filters.categoryId) {
      query += " AND a.category_id = ?";
      params.push(filters.categoryId);
    }

    if (filters.search) {
      query += " AND (a.activity_name LIKE ? OR a.description LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.minRating) {
      query += " AND a.average_rating >= ?";
      params.push(filters.minRating);
    }

    if (filters.maxCost) {
      query += " AND a.estimated_cost <= ?";
      params.push(filters.maxCost);
    }

    if (filters.difficultyLevel) {
      query += " AND a.difficulty_level = ?";
      params.push(filters.difficultyLevel);
    }

    if (filters.isFeatured !== undefined) {
      query += " AND a.is_featured = ?";
      params.push(filters.isFeatured);
    }

    const sortBy = filters.sortBy || "average_rating";
    const sortOrder = filters.sortOrder || "DESC";
    query += ` ORDER BY a.${sortBy} ${sortOrder}`;

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const results = await executeQuery(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM activities a WHERE 1=1";
    const countParams = [];

    if (filters.cityId) {
      countQuery += " AND a.city_id = ?";
      countParams.push(filters.cityId);
    }
    if (filters.categoryId) {
      countQuery += " AND a.category_id = ?";
      countParams.push(filters.categoryId);
    }

    const countResult = await executeQuery(countQuery, countParams);

    return {
      activities: results,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit),
      },
    };
  }

  // Get activity by ID
  static async findById(activityId) {
    const query = `
      SELECT 
        a.*,
        c.city_name,
        co.country_name,
        ac.category_name
      FROM activities a
      JOIN cities c ON a.city_id = c.city_id
      JOIN countries co ON c.country_id = co.country_id
      JOIN activity_categories ac ON a.category_id = ac.category_id
      WHERE a.activity_id = ?
    `;

    const results = await executeQuery(query, [activityId]);
    return results[0] || null;
  }

  // Increment popularity
  static async incrementPopularity(activityId) {
    const query = "UPDATE activities SET popularity_count = popularity_count + 1 WHERE activity_id = ?";
    await executeQuery(query, [activityId]);
  }

  // Get activities by city
  static async getByCity(cityId, limit = 20) {
    const query = `
      SELECT 
        a.activity_id,
        a.activity_name,
        ac.category_name,
        a.estimated_duration_minutes,
        a.estimated_cost,
        a.currency,
        a.average_rating,
        a.total_reviews,
        a.image_url
      FROM activities a
      JOIN activity_categories ac ON a.category_id = ac.category_id
      WHERE a.city_id = ?
      ORDER BY a.average_rating DESC, a.total_reviews DESC
      LIMIT ?
    `;

    return await executeQuery(query, [cityId, limit]);
  }
}

class ActivityCategory {
  // Get all categories
  static async getAll() {
    const query = `
      SELECT 
        category_id,
        category_name,
        category_icon,
        description,
        display_order
      FROM activity_categories
      ORDER BY display_order ASC
    `;

    return await executeQuery(query);
  }

  // Get category by ID
  static async findById(categoryId) {
    const query = "SELECT * FROM activity_categories WHERE category_id = ?";
    const results = await executeQuery(query, [categoryId]);
    return results[0] || null;
  }
}

class ActivityReview {
  // Create review
  static async create(reviewData) {
    const query = `
      INSERT INTO activity_reviews (
        activity_id, user_id, rating, review_title,
        review_text, photos, visit_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      reviewData.activityId,
      reviewData.userId,
      reviewData.rating,
      reviewData.reviewTitle || null,
      reviewData.reviewText || null,
      reviewData.photos ? JSON.stringify(reviewData.photos) : null,
      reviewData.visitDate || null,
    ];

    const result = await executeQuery(query, params);
    return result.insertId;
  }

  // Get reviews for activity
  static async getByActivity(activityId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        ar.review_id,
        ar.rating,
        ar.review_title,
        ar.review_text,
        ar.photos,
        ar.helpful_count,
        ar.visit_date,
        ar.created_at,
        u.user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.profile_picture_url
      FROM activity_reviews ar
      JOIN users u ON ar.user_id = u.user_id
      WHERE ar.activity_id = ?
      ORDER BY ar.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const results = await executeQuery(query, [activityId, limit, offset]);

    // Get total count
    const countQuery = "SELECT COUNT(*) as total FROM activity_reviews WHERE activity_id = ?";
    const countResult = await executeQuery(countQuery, [activityId]);

    return {
      reviews: results,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit),
      },
    };
  }

  // Update review
  static async update(reviewId, userId, updateData) {
    const query = `
      UPDATE activity_reviews 
      SET rating = ?, review_title = ?, review_text = ?, photos = ?
      WHERE review_id = ? AND user_id = ?
    `;

    const params = [
      updateData.rating,
      updateData.reviewTitle || null,
      updateData.reviewText || null,
      updateData.photos ? JSON.stringify(updateData.photos) : null,
      reviewId,
      userId,
    ];

    await executeQuery(query, params);
  }

  // Delete review
  static async delete(reviewId, userId) {
    const query = "DELETE FROM activity_reviews WHERE review_id = ? AND user_id = ?";
    await executeQuery(query, [reviewId, userId]);
  }

  // Mark review as helpful
  static async markHelpful(reviewId) {
    const query = "UPDATE activity_reviews SET helpful_count = helpful_count + 1 WHERE review_id = ?";
    await executeQuery(query, [reviewId]);
  }

  // Check if user already reviewed
  static async hasUserReviewed(activityId, userId) {
    const query = "SELECT COUNT(*) as count FROM activity_reviews WHERE activity_id = ? AND user_id = ?";
    const results = await executeQuery(query, [activityId, userId]);
    return results[0].count > 0;
  }
}

module.exports = {
  Activity,
  ActivityCategory,
  ActivityReview,
};
