const express = require("express");
const router = express.Router();
const {
  getAllCities,
  getCityById,
  getPopularCities,
  getFeaturedCities,
  searchCities,
  getCitiesByCountry,
} = require("../controllers/cityController");

// Search cities (must come before /:cityId)
router.get("/search", searchCities);

// Get popular cities
router.get("/popular/list", getPopularCities);

// Get featured cities
router.get("/featured/list", getFeaturedCities);

// Get cities by country
router.get("/country/:countryId", getCitiesByCountry);

// Get all cities
router.get("/", getAllCities);

// Get city by ID
router.get("/:cityId", getCityById);

module.exports = router;
