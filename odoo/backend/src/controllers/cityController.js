const City = require("../models/City");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Get all cities with filters and pagination
 * @route GET /api/cities
 * @access Public
 */
const getAllCities = async (req, res) => {
  try {
    const {
      page,
      limit,
      countryId,
      continent,
      isFeatured,
      search,
      minSafetyRating,
      maxCostIndex,
      sortBy,
      sortOrder,
    } = req.query;

    const filters = {};
    if (countryId) filters.countryId = parseInt(countryId);
    if (continent) filters.continent = continent;
    if (isFeatured !== undefined) filters.isFeatured = isFeatured === "true";
    if (search) filters.search = search;
    if (minSafetyRating) filters.minSafetyRating = parseFloat(minSafetyRating);
    if (maxCostIndex) filters.maxCostIndex = parseFloat(maxCostIndex);
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;

    const pagination = {};
    if (page) pagination.page = parseInt(page);
    if (limit) pagination.limit = parseInt(limit);

    const result = await City.getAll(filters, pagination);

    return ApiResponse.success(
      res,
      200,
      "Cities retrieved successfully",
      result
    );
  } catch (error) {
    console.error("Get all cities error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve cities");
  }
};

/**
 * Get city by ID
 * @route GET /api/cities/:cityId
 * @access Public
 */
const getCityById = async (req, res) => {
  try {
    const { cityId } = req.params;

    const city = await City.findById(cityId);

    if (!city) {
      return ApiResponse.notFound(res, "City not found");
    }

    // Increment popularity score
    await City.incrementPopularity(cityId);

    return ApiResponse.success(res, 200, "City retrieved successfully", city);
  } catch (error) {
    console.error("Get city by ID error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve city");
  }
};

/**
 * Get popular cities
 * @route GET /api/cities/popular/list
 * @access Public
 */
const getPopularCities = async (req, res) => {
  try {
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit) : 10;

    const cities = await City.getPopular(limitNum);

    return ApiResponse.success(
      res,
      200,
      "Popular cities retrieved successfully",
      {
        cities,
        count: cities.length,
      }
    );
  } catch (error) {
    console.error("Get popular cities error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve popular cities");
  }
};

/**
 * Get featured cities
 * @route GET /api/cities/featured/list
 * @access Public
 */
const getFeaturedCities = async (req, res) => {
  try {
    const cities = await City.getFeatured();

    return ApiResponse.success(
      res,
      200,
      "Featured cities retrieved successfully",
      {
        cities,
        count: cities.length,
      }
    );
  } catch (error) {
    console.error("Get featured cities error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve featured cities");
  }
};

/**
 * Search cities
 * @route GET /api/cities/search
 * @access Public
 */
const searchCities = async (req, res) => {
  try {
    const { q, limit } = req.query;

    if (!q || q.trim().length === 0) {
      return ApiResponse.badRequest(res, "Search query is required");
    }

    const limitNum = limit ? parseInt(limit) : 10;
    const cities = await City.search(q, limitNum);

    return ApiResponse.success(res, 200, "Search completed successfully", {
      query: q,
      cities,
      count: cities.length,
    });
  } catch (error) {
    console.error("Search cities error:", error);
    return ApiResponse.serverError(res, "Failed to search cities");
  }
};

/**
 * Get cities by country
 * @route GET /api/cities/country/:countryId
 * @access Public
 */
const getCitiesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;

    const cities = await City.getByCountry(countryId);

    return ApiResponse.success(
      res,
      200,
      "Cities retrieved successfully",
      {
        countryId: parseInt(countryId),
        cities,
        count: cities.length,
      }
    );
  } catch (error) {
    console.error("Get cities by country error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve cities");
  }
};

module.exports = {
  getAllCities,
  getCityById,
  getPopularCities,
  getFeaturedCities,
  searchCities,
  getCitiesByCountry,
};
