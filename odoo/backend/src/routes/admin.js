const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllUsers,
  updateUserStatus,
  getAllTrips,
  deleteTrip,
  getPlatformStatistics,
  addCity,
  updateCity,
  addActivity,
} = require("../controllers/adminController");

// All admin routes require both authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// User management
router.get("/users", getAllUsers);
router.patch("/users/:userId/status", updateUserStatus);

// Trip management
router.get("/trips", getAllTrips);
router.delete("/trips/:tripId", deleteTrip);

// Platform statistics
router.get("/statistics", getPlatformStatistics);

// Content management
router.post("/cities", addCity);
router.put("/cities/:cityId", updateCity);
router.post("/activities", addActivity);

module.exports = router;
