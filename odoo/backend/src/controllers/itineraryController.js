const ItineraryItem = require("../models/Itinerary");
const ApiResponse = require("../utils/ApiResponse");

const createItineraryItem = async (req, res) => {
  try {
    const { stopId } = req.params;
    const itemData = { ...req.body, stopId };

    const itemId = await ItineraryItem.create(itemData);
    const item = await ItineraryItem.findById(itemId);

    return ApiResponse.success(res, 201, "Itinerary item created successfully", item);
  } catch (error) {
    console.error("Create itinerary item error:", error);
    return ApiResponse.serverError(res, "Failed to create itinerary item");
  }
};

const getStopItinerary = async (req, res) => {
  try {
    const { stopId } = req.params;
    const items = await ItineraryItem.getByStop(stopId);

    return ApiResponse.success(res, 200, "Itinerary items retrieved successfully", { items, count: items.length });
  } catch (error) {
    console.error("Get stop itinerary error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve itinerary");
  }
};

const getTripItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const items = await ItineraryItem.getByTrip(tripId);

    return ApiResponse.success(res, 200, "Trip itinerary retrieved successfully", { items, count: items.length });
  } catch (error) {
    console.error("Get trip itinerary error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve itinerary");
  }
};

const getItineraryItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ItineraryItem.findById(itemId);

    if (!item) {
      return ApiResponse.notFound(res, "Itinerary item not found");
    }

    return ApiResponse.success(res, 200, "Itinerary item retrieved successfully", item);
  } catch (error) {
    console.error("Get itinerary item error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve item");
  }
};

const updateItineraryItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updateData = req.body;

    await ItineraryItem.update(itemId, updateData);
    const item = await ItineraryItem.findById(itemId);

    return ApiResponse.success(res, 200, "Itinerary item updated successfully", item);
  } catch (error) {
    console.error("Update itinerary item error:", error);
    return ApiResponse.serverError(res, "Failed to update item");
  }
};

const markItemCompleted = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { isCompleted } = req.body;

    await ItineraryItem.markCompleted(itemId, isCompleted);
    return ApiResponse.success(res, 200, "Item status updated successfully");
  } catch (error) {
    console.error("Mark item completed error:", error);
    return ApiResponse.serverError(res, "Failed to update item status");
  }
};

const deleteItineraryItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    await ItineraryItem.delete(itemId);
    return ApiResponse.success(res, 200, "Itinerary item deleted successfully");
  } catch (error) {
    console.error("Delete itinerary item error:", error);
    return ApiResponse.serverError(res, "Failed to delete item");
  }
};

const reorderItineraryItems = async (req, res) => {
  try {
    const { stopId } = req.params;
    const { itemOrders } = req.body;

    await ItineraryItem.reorderItems(stopId, itemOrders);
    return ApiResponse.success(res, 200, "Itinerary items reordered successfully");
  } catch (error) {
    console.error("Reorder items error:", error);
    return ApiResponse.serverError(res, "Failed to reorder items");
  }
};

module.exports = {
  createItineraryItem,
  getStopItinerary,
  getTripItinerary,
  getItineraryItemById,
  updateItineraryItem,
  markItemCompleted,
  deleteItineraryItem,
  reorderItineraryItems,
};
