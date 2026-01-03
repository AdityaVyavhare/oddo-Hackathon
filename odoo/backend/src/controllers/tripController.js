const Trip = require("../models/Trip");
const TripStop = require("../models/TripStop");
const ApiResponse = require("../utils/ApiResponse");

const createTrip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      tripName,
      description,
      startDate,
      endDate,
      totalBudget,
      currency,
      coverImageUrl,
      isPublic,
      tags,
    } = req.body;

    const tripData = {
      userId,
      tripName,
      description,
      startDate,
      endDate,
      totalBudget,
      currency,
      coverImageUrl,
      isPublic,
      tags,
    };
    const tripId = await Trip.create(tripData);

    const trip = await Trip.findById(tripId);
    return ApiResponse.success(res, 201, "Trip created successfully", trip);
  } catch (error) {
    console.error("Create trip error:", error);
    return ApiResponse.serverError(res, "Failed to create trip");
  }
};

const getUserTrips = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const filters = {};
    if (status) filters.status = status;

    const trips = await Trip.getUserTrips(userId, filters);
    return ApiResponse.success(res, 200, "Trips retrieved successfully", {
      trips,
      count: trips.length,
    });
  } catch (error) {
    console.error("Get user trips error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve trips");
  }
};

const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return ApiResponse.notFound(res, "Trip not found");
    }

    await Trip.incrementViewCount(tripId);
    return ApiResponse.success(res, 200, "Trip retrieved successfully", trip);
  } catch (error) {
    console.error("Get trip error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve trip");
  }
};

const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;

    await Trip.update(tripId, userId, updateData);
    const trip = await Trip.findById(tripId);

    return ApiResponse.success(res, 200, "Trip updated successfully", trip);
  } catch (error) {
    console.error("Update trip error:", error);
    return ApiResponse.serverError(res, "Failed to update trip");
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;

    await Trip.delete(tripId, userId);
    return ApiResponse.success(res, 200, "Trip deleted successfully");
  } catch (error) {
    console.error("Delete trip error:", error);
    return ApiResponse.serverError(res, "Failed to delete trip");
  }
};

const getPublicTrips = async (req, res) => {
  try {
    const { search, page, limit } = req.query;

    const filters = {};
    if (search) filters.search = search;

    const pagination = {};
    if (page) pagination.page = parseInt(page);
    if (limit) pagination.limit = parseInt(limit);

    const result = await Trip.getPublicTrips(filters, pagination);
    return ApiResponse.success(
      res,
      200,
      "Public trips retrieved successfully",
      result
    );
  } catch (error) {
    console.error("Get public trips error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve trips");
  }
};

const getTripByShareToken = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const trip = await Trip.getByShareToken(shareToken);

    if (!trip) {
      return ApiResponse.notFound(res, "Trip not found");
    }

    await Trip.incrementViewCount(trip.trip_id);
    return ApiResponse.success(
      res,
      200,
      "Shared trip retrieved successfully",
      trip
    );
  } catch (error) {
    console.error("Get shared trip error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve trip");
  }
};

const likeTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;

    await Trip.like(tripId, userId);
    return ApiResponse.success(res, 200, "Trip liked successfully");
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return ApiResponse.conflict(res, "Trip already liked");
    }
    console.error("Like trip error:", error);
    return ApiResponse.serverError(res, "Failed to like trip");
  }
};

const unlikeTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;

    await Trip.unlike(tripId, userId);
    return ApiResponse.success(res, 200, "Trip unliked successfully");
  } catch (error) {
    console.error("Unlike trip error:", error);
    return ApiResponse.serverError(res, "Failed to unlike trip");
  }
};

const cloneTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;

    const newTripId = await Trip.clone(tripId, userId);
    const trip = await Trip.findById(newTripId);

    return ApiResponse.success(res, 201, "Trip cloned successfully", trip);
  } catch (error) {
    console.error("Clone trip error:", error);
    return ApiResponse.serverError(res, "Failed to clone trip");
  }
};

module.exports = {
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
};
