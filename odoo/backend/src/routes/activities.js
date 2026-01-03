const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllActivities,
  getActivityById,
  getActivitiesByCity,
  getAllCategories,
  getActivityReviews,
  createActivityReview,
  updateActivityReview,
  deleteActivityReview,
  markReviewHelpful,
} = require("../controllers/activityController");

// Categories
router.get("/categories", getAllCategories);

// Activities by city
router.get("/city/:cityId", getActivitiesByCity);

// All activities
router.get("/", getAllActivities);

// Activity details
router.get("/:activityId", getActivityById);

// Reviews
router.get("/:activityId/reviews", getActivityReviews);
router.post("/:activityId/reviews", authMiddleware, createActivityReview);
router.put("/reviews/:reviewId", authMiddleware, updateActivityReview);
router.delete("/reviews/:reviewId", authMiddleware, deleteActivityReview);
router.post("/reviews/:reviewId/helpful", markReviewHelpful);

module.exports = router;
