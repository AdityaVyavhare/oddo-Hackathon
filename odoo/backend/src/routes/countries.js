const express = require("express");
const router = express.Router();
const {
  getAllCountries,
  getCountryById,
  getContinents,
  getCountriesByContinent,
} = require("../controllers/countryController");

// Get all continents (must come before /:countryId)
router.get("/continents/list", getContinents);

// Get countries by continent
router.get("/continent/:continent", getCountriesByContinent);

// Get all countries
router.get("/", getAllCountries);

// Get country by ID
router.get("/:countryId", getCountryById);

module.exports = router;
