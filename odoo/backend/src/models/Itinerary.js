const { executeQuery } = require("../config/database");

class ItineraryItem {
  static async create(itemData) {
    const query = `
      INSERT INTO itinerary_items (
        stop_id, activity_id, day_number, item_date, start_time, end_time,
        item_type, title, description, estimated_cost, actual_cost,
        location, booking_status, booking_reference, priority, notes, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      itemData.stopId,
      itemData.activityId || null,
      itemData.dayNumber,
      itemData.itemDate,
      itemData.startTime || null,
      itemData.endTime || null,
      itemData.itemType || "activity",
      itemData.title,
      itemData.description || null,
      itemData.estimatedCost || null,
      itemData.actualCost || null,
      itemData.location || null,
      itemData.bookingStatus || "not_required",
      itemData.bookingReference || null,
      itemData.priority || "medium",
      itemData.notes || null,
      itemData.displayOrder || 0,
    ];

    const result = await executeQuery(query, params);
    return result.insertId;
  }

  static async getByStop(stopId) {
    const query = `
      SELECT 
        ii.*,
        a.activity_name,
        a.estimated_duration_minutes
      FROM itinerary_items ii
      LEFT JOIN activities a ON ii.activity_id = a.activity_id
      WHERE ii.stop_id = ?
      ORDER BY ii.item_date ASC, ii.start_time ASC, ii.display_order ASC
    `;

    return await executeQuery(query, [stopId]);
  }

  static async getByTrip(tripId) {
    const query = `
      SELECT 
        ii.*,
        ts.stop_order,
        c.city_name,
        a.activity_name
      FROM itinerary_items ii
      JOIN trip_stops ts ON ii.stop_id = ts.stop_id
      JOIN cities c ON ts.city_id = c.city_id
      LEFT JOIN activities a ON ii.activity_id = a.activity_id
      WHERE ts.trip_id = ?
      ORDER BY ts.stop_order ASC, ii.item_date ASC, ii.start_time ASC
    `;

    return await executeQuery(query, [tripId]);
  }

  static async findById(itemId) {
    const query = "SELECT * FROM itinerary_items WHERE item_id = ?";
    const results = await executeQuery(query, [itemId]);
    return results[0] || null;
  }

  static async update(itemId, updateData) {
    const allowedFields = [
      "activity_id", "day_number", "item_date", "start_time", "end_time",
      "item_type", "title", "description", "estimated_cost", "actual_cost",
      "location", "booking_status", "booking_reference", "priority", "notes", "display_order"
    ];

    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error("No valid fields to update");
    }

    params.push(itemId);
    const query = `UPDATE itinerary_items SET ${updates.join(", ")} WHERE item_id = ?`;
    await executeQuery(query, params);
  }

  static async markCompleted(itemId, isCompleted = true) {
    const query = "UPDATE itinerary_items SET is_completed = ? WHERE item_id = ?";
    await executeQuery(query, [isCompleted, itemId]);
  }

  static async delete(itemId) {
    const query = "DELETE FROM itinerary_items WHERE item_id = ?";
    await executeQuery(query, [itemId]);
  }

  static async reorderItems(stopId, itemOrders) {
    for (const { itemId, displayOrder } of itemOrders) {
      const query = "UPDATE itinerary_items SET display_order = ? WHERE item_id = ? AND stop_id = ?";
      await executeQuery(query, [displayOrder, itemId, stopId]);
    }
  }
}

module.exports = ItineraryItem;
