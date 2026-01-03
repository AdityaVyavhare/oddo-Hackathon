const TripStop = require("../models/TripStop");
const ApiResponse = require("../utils/ApiResponse");

const createTripStop = async (req, res) => {
  try {
    const { tripId } = req.params;
    const stopData = { ...req.body, tripId };

    const stopId = await TripStop.create(stopData);
    const stop = await TripStop.findById(stopId);

    return ApiResponse.success(res, 201, "Trip stop created successfully", stop);
  } catch (error) {
    console.error("Create trip stop error:", error);
    return ApiResponse.serverError(res, "Failed to create trip stop");
  }
};

const getTripStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const stops = await TripStop.getTripStops(tripId);

    return ApiResponse.success(res, 200, "Trip stops retrieved successfully", { stops, count: stops.length });
  } catch (error) {
    console.error("Get trip stops error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve trip stops");
  }
};

const getTripStopById = async (req, res) => {
  try {
    const { stopId } = req.params;
    const stop = await TripStop.findById(stopId);

    if (!stop) {
      return ApiResponse.notFound(res, "Trip stop not found");
    }

    return ApiResponse.success(res, 200, "Trip stop retrieved successfully", stop);
  } catch (error) {
    console.error("Get trip stop error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve trip stop");
  }
};

const updateTripStop = async (req, res) => {
  try {
    const { stopId } = req.params;
    const updateData = req.body;

    await TripStop.update(stopId, updateData);
    const stop = await TripStop.findById(stopId);

    return ApiResponse.success(res, 200, "Trip stop updated successfully", stop);
  } catch (error) {
    console.error("Update trip stop error:", error);
    return ApiResponse.serverError(res, "Failed to update trip stop");
  }
};

const deleteTripStop = async (req, res) => {
  try {
    const { stopId } = req.params;

    await TripStop.delete(stopId);
    return ApiResponse.success(res, 200, "Trip stop deleted successfully");
  } catch (error) {
    console.error("Delete trip stop error:", error);
    return ApiResponse.serverError(res, "Failed to delete trip stop");
  }
};

const reorderTripStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { stopOrders } = req.body;

    await TripStop.reorderStops(tripId, stopOrders);
    return ApiResponse.success(res, 200, "Trip stops reordered successfully");
  } catch (error) {
    console.error("Reorder stops error:", error);
    return ApiResponse.serverError(res, "Failed to reorder stops");
  }
};

module.exports = {
  createTripStop,
  getTripStops,
  getTripStopById,
  updateTripStop,
  deleteTripStop,
  reorderTripStops,
};
