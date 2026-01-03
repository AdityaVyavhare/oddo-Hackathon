const { executeQuery } = require("../config/database");

class City {
  // Get all cities with filters and pagination
  static async getAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        c.city_id,
        c.city_name,
        c.country_id,
        co.country_name,
        co.country_code,
        co.continent,
        c.state_province,
        c.latitude,
        c.longitude,
        c.description,
        c.population,
        c.cost_index,
        c.safety_rating,
        c.popularity_score,
        c.best_time_to_visit,
        c.average_temperature,
        c.image_url,
        c.timezone,
        c.is_featured
      FROM cities c
      JOIN countries co ON c.country_id = co.country_id
      WHERE 1=1
    `;

    const params = [];

    if (filters.countryId) {
      query += " AND c.country_id = ?";
      params.push(filters.countryId);
    }

    if (filters.continent) {
      query += " AND co.continent = ?";
      params.push(filters.continent);
    }

    if (filters.isFeatured !== undefined) {
      query += " AND c.is_featured = ?";
      params.push(filters.isFeatured);
    }

    if (filters.search) {
      query += " AND (c.city_name LIKE ? OR co.country_name LIKE ? OR c.description LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.minSafetyRating) {
      query += " AND c.safety_rating >= ?";
      params.push(filters.minSafetyRating);
    }

    if (filters.maxCostIndex) {
      query += " AND c.cost_index <= ?";
      params.push(filters.maxCostIndex);
    }

    // Sorting
    const sortBy = filters.sortBy || "popularity_score";
    const sortOrder = filters.sortOrder || "DESC";
    query += ` ORDER BY c.${sortBy} ${sortOrder}`;

    // Pagination
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const results = await executeQuery(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM cities c
      JOIN countries co ON c.country_id = co.country_id
      WHERE 1=1
    `;

    const countParams = [];
    if (filters.countryId) {
      countQuery += " AND c.country_id = ?";
      countParams.push(filters.countryId);
    }
    if (filters.continent) {
      countQuery += " AND co.continent = ?";
      countParams.push(filters.continent);
    }
    if (filters.isFeatured !== undefined) {
      countQuery += " AND c.is_featured = ?";
      countParams.push(filters.isFeatured);
    }
    if (filters.search) {
      countQuery += " AND (c.city_name LIKE ? OR co.country_name LIKE ? OR c.description LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult[0].total;

    return {
      cities: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get city by ID
  static async findById(cityId) {
    const query = `
      SELECT 
        c.city_id,
        c.city_name,
        c.country_id,
        co.country_name,
        co.country_code,
        co.continent,
        co.currency,
        co.currency_symbol,
        c.state_province,
        c.latitude,
        c.longitude,
        c.description,
        c.population,
        c.cost_index,
        c.safety_rating,
        c.popularity_score,
        c.best_time_to_visit,
        c.average_temperature,
        c.image_url,
        c.timezone,
        c.is_featured,
        c.created_at,
        c.updated_at
      FROM cities c
      JOIN countries co ON c.country_id = co.country_id
      WHERE c.city_id = ?
    `;

    const results = await executeQuery(query, [cityId]);
    return results[0] || null;
  }

  // Get popular cities
  static async getPopular(limit = 10) {
    const query = `
      SELECT * FROM vw_popular_destinations
      LIMIT ?
    `;

    return await executeQuery(query, [limit]);
  }

  // Get featured cities
  static async getFeatured() {
    const query = `
      SELECT 
        c.city_id,
        c.city_name,
        co.country_name,
        c.description,
        c.image_url,
        c.popularity_score,
        c.safety_rating
      FROM cities c
      JOIN countries co ON c.country_id = co.country_id
      WHERE c.is_featured = TRUE
      ORDER BY c.popularity_score DESC
    `;

    return await executeQuery(query);
  }

  // Search cities
  static async search(searchTerm, limit = 10) {
    const query = `
      SELECT 
        c.city_id,
        c.city_name,
        co.country_name,
        co.country_code,
        c.state_province,
        c.image_url
      FROM cities c
      JOIN countries co ON c.country_id = co.country_id
      WHERE c.city_name LIKE ? OR co.country_name LIKE ?
      ORDER BY c.popularity_score DESC
      LIMIT ?
    `;

    const term = `%${searchTerm}%`;
    return await executeQuery(query, [term, term, limit]);
  }

  // Get cities by country
  static async getByCountry(countryId) {
    const query = `
      SELECT 
        city_id,
        city_name,
        state_province,
        population,
        cost_index,
        safety_rating,
        image_url
      FROM cities
      WHERE country_id = ?
      ORDER BY popularity_score DESC
    `;

    return await executeQuery(query, [countryId]);
  }

  // Increment popularity score
  static async incrementPopularity(cityId) {
    const query = "UPDATE cities SET popularity_score = popularity_score + 1 WHERE city_id = ?";
    await executeQuery(query, [cityId]);
  }
}

module.exports = City;
