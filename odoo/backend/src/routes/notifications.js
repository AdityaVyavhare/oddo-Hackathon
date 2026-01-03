const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// All notification routes require authentication
router.use(authMiddleware);

router.get("/", getNotifications);
router.patch("/:notificationId/read", markNotificationAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

module.exports = router;
