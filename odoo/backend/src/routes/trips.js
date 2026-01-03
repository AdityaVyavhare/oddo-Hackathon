const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getPublicTrips,
  getTripByShareToken,
  likeTrip,
  unlikeTrip,
  cloneTrip,
} = require("../controllers/tripController");
const {
  createTripStop,
  getTripStops,
  getTripStopById,
  updateTripStop,
  deleteTripStop,
  reorderTripStops,
} = require("../controllers/tripStopController");
const {
  createItineraryItem,
  getStopItinerary,
  getTripItinerary,
  getItineraryItemById,
  updateItineraryItem,
  markItemCompleted,
  deleteItineraryItem,
  reorderItineraryItems,
} = require("../controllers/itineraryController");
const {
  createExpense,
  getTripExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getBudgetSummary,
  getExpenseBreakdown,
} = require("../controllers/expenseController");

// Trip Routes
router.get("/public", getPublicTrips);
router.get("/shared/:shareToken", getTripByShareToken);
router.get("/my-trips", authMiddleware, getUserTrips);
router.post("/", authMiddleware, createTrip);
router.get("/:tripId", getTripById);
router.put("/:tripId", authMiddleware, updateTrip);
router.delete("/:tripId", authMiddleware, deleteTrip);
router.post("/:tripId/like", authMiddleware, likeTrip);
router.delete("/:tripId/unlike", authMiddleware, unlikeTrip);
router.post("/:tripId/clone", authMiddleware, cloneTrip);

// Trip Stops Routes
router.get("/:tripId/stops", getTripStops);
router.post("/:tripId/stops", authMiddleware, createTripStop);
router.get("/:tripId/stops/:stopId", getTripStopById);
router.put("/:tripId/stops/:stopId", authMiddleware, updateTripStop);
router.delete("/:tripId/stops/:stopId", authMiddleware, deleteTripStop);
router.patch("/:tripId/stops/reorder", authMiddleware, reorderTripStops);

// Itinerary Routes
router.get("/:tripId/itinerary", getTripItinerary);
router.get("/stops/:stopId/itinerary", getStopItinerary);
router.post("/stops/:stopId/itinerary", authMiddleware, createItineraryItem);
router.get("/itinerary/:itemId", getItineraryItemById);
router.put("/itinerary/:itemId", authMiddleware, updateItineraryItem);
router.patch("/itinerary/:itemId/complete", authMiddleware, markItemCompleted);
router.delete("/itinerary/:itemId", authMiddleware, deleteItineraryItem);
router.patch(
  "/stops/:stopId/itinerary/reorder",
  authMiddleware,
  reorderItineraryItems
);

// Expense Routes
router.get("/:tripId/expenses", getTripExpenses);
router.post("/:tripId/expenses", authMiddleware, createExpense);
router.get("/:tripId/expenses/:expenseId", getExpenseById);
router.put("/:tripId/expenses/:expenseId", authMiddleware, updateExpense);
router.delete("/:tripId/expenses/:expenseId", authMiddleware, deleteExpense);
router.get("/:tripId/budget/summary", getBudgetSummary);
router.get("/:tripId/budget/breakdown", getExpenseBreakdown);

module.exports = router;
