const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getWishlist,
  addCityToWishlist,
  removeCityFromWishlist,
  addActivityToWishlist,
  removeActivityFromWishlist,
  checkWishlistItem,
} = require("../controllers/wishlistController");

// All wishlist routes require authentication
router.use(authMiddleware);

// Get complete wishlist
router.get("/", getWishlist);

// City wishlist
router.post("/cities/:cityId", addCityToWishlist);
router.delete("/cities/:cityId", removeCityFromWishlist);

// Activity wishlist
router.post("/activities/:activityId", addActivityToWishlist);
router.delete("/activities/:activityId", removeActivityFromWishlist);

// Check if item is in wishlist
router.get("/check/:type/:id", checkWishlistItem);

module.exports = router;
