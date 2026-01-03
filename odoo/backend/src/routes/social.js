const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
  getActivityFeed,
  getTripComments,
  addTripComment,
  deleteTripComment,
} = require("../controllers/socialController");

// Follow/Unfollow (require auth)
router.post("/users/:userId/follow", authMiddleware, followUser);
router.delete("/users/:userId/unfollow", authMiddleware, unfollowUser);

// Get followers/following (public)
router.get("/users/:userId/followers", getUserFollowers);
router.get("/users/:userId/following", getUserFollowing);

// Activity feed (require auth)
router.get("/feed", authMiddleware, getActivityFeed);

// Trip comments
router.get("/trips/:tripId/comments", getTripComments);
router.post("/trips/:tripId/comments", authMiddleware, addTripComment);
router.delete("/comments/:commentId", authMiddleware, deleteTripComment);

module.exports = router;
