const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  globalSearch,
  searchTrips,
  searchUsers,
  getRecommendedTrips,
  getRecommendedActivities,
  getTrendingDestinations,
} = require("../controllers/searchController");

// Global search (public)
router.get("/", globalSearch);

// Specific searches (public)
router.get("/trips", searchTrips);
router.get("/users", searchUsers);

// Recommendations (require auth for personalized results)
router.get("/recommendations/trips", authMiddleware, getRecommendedTrips);
router.get("/recommendations/activities/:cityId", getRecommendedActivities);

// Trending (public)
router.get("/trending/destinations", getTrendingDestinations);

module.exports = router;
