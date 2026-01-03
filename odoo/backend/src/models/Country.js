const { executeQuery } = require("../config/database");

class Country {
  // Get all countries with optional filters
  static async getAll(filters = {}) {
    let query = `
      SELECT 
        country_id,
        country_name,
        country_code,
        continent,
        currency,
        currency_symbol,
        timezone,
        popular_season,
        visa_info,
        created_at
      FROM countries
      WHERE 1=1
    `;

    const params = [];

    if (filters.continent) {
      query += " AND continent = ?";
      params.push(filters.continent);
    }

    if (filters.currency) {
      query += " AND currency = ?";
      params.push(filters.currency);
    }

    if (filters.search) {
      query += " AND (country_name LIKE ? OR country_code LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += " ORDER BY country_name ASC";

    const results = await executeQuery(query, params);
    return results;
  }

  // Get country by ID
  static async findById(countryId) {
    const query = `
      SELECT 
        country_id,
        country_name,
        country_code,
        continent,
        currency,
        currency_symbol,
        timezone,
        popular_season,
        visa_info,
        created_at
      FROM countries
      WHERE country_id = ?
    `;

    const results = await executeQuery(query, [countryId]);
    return results[0] || null;
  }

  // Get all continents
  static async getContinents() {
    const query =
      "SELECT DISTINCT continent FROM countries ORDER BY continent ASC";
    const results = await executeQuery(query);
    return results.map((row) => row.continent);
  }

  // Get countries by continent
  static async getByContinent(continent) {
    const query = `
      SELECT 
        country_id,
        country_name,
        country_code,
        currency,
        currency_symbol
      FROM countries
      WHERE continent = ?
      ORDER BY country_name ASC
    `;

    return await executeQuery(query, [continent]);
  }
}

module.exports = Country;
