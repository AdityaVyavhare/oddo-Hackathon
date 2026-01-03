const Country = require("../models/Country");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Get all countries
 * @route GET /api/countries
 * @access Public
 */
const getAllCountries = async (req, res) => {
  try {
    const { continent, currency, search } = req.query;

    const filters = {};
    if (continent) filters.continent = continent;
    if (currency) filters.currency = currency;
    if (search) filters.search = search;

    const countries = await Country.getAll(filters);

    return ApiResponse.success(
      res,
      200,
      "Countries retrieved successfully",
      {
        countries,
        count: countries.length,
      }
    );
  } catch (error) {
    console.error("Get all countries error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve countries");
  }
};

/**
 * Get country by ID
 * @route GET /api/countries/:countryId
 * @access Public
 */
const getCountryById = async (req, res) => {
  try {
    const { countryId } = req.params;

    const country = await Country.findById(countryId);

    if (!country) {
      return ApiResponse.notFound(res, "Country not found");
    }

    return ApiResponse.success(
      res,
      200,
      "Country retrieved successfully",
      country
    );
  } catch (error) {
    console.error("Get country by ID error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve country");
  }
};

/**
 * Get all continents
 * @route GET /api/countries/continents/list
 * @access Public
 */
const getContinents = async (req, res) => {
  try {
    const continents = await Country.getContinents();

    return ApiResponse.success(
      res,
      200,
      "Continents retrieved successfully",
      { continents }
    );
  } catch (error) {
    console.error("Get continents error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve continents");
  }
};

/**
 * Get countries by continent
 * @route GET /api/countries/continent/:continent
 * @access Public
 */
const getCountriesByContinent = async (req, res) => {
  try {
    const { continent } = req.params;

    const countries = await Country.getByContinent(continent);

    return ApiResponse.success(
      res,
      200,
      `Countries in ${continent} retrieved successfully`,
      {
        continent,
        countries,
        count: countries.length,
      }
    );
  } catch (error) {
    console.error("Get countries by continent error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve countries");
  }
};

module.exports = {
  getAllCountries,
  getCountryById,
  getContinents,
  getCountriesByContinent,
};
