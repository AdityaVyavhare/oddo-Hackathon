const { executeQuery } = require("../config/database");

class TripStop {
  static async create(stopData) {
    const query = `
      INSERT INTO trip_stops (
        trip_id, city_id, stop_order, arrival_date, departure_date,
        accommodation_name, accommodation_address, accommodation_cost,
        accommodation_booking_ref, transportation_mode, transportation_cost,
        transportation_details, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      stopData.tripId,
      stopData.cityId,
      stopData.stopOrder,
      stopData.arrivalDate,
      stopData.departureDate,
      stopData.accommodationName || null,
      stopData.accommodationAddress || null,
      stopData.accommodationCost || null,
      stopData.accommodationBookingRef || null,
      stopData.transportationMode || "Flight",
      stopData.transportationCost || null,
      stopData.transportationDetails || null,
      stopData.notes || null,
    ];

    const result = await executeQuery(query, params);
    return result.insertId;
  }

  static async getTripStops(tripId) {
    const query = `
      SELECT 
        ts.*,
        c.city_name,
        co.country_name
      FROM trip_stops ts
      JOIN cities c ON ts.city_id = c.city_id
      JOIN countries co ON c.country_id = co.country_id
      WHERE ts.trip_id = ?
      ORDER BY ts.stop_order ASC
    `;

    return await executeQuery(query, [tripId]);
  }

  static async findById(stopId) {
    const query = `
      SELECT 
        ts.*,
        c.city_name,
        co.country_name
      FROM trip_stops ts
      JOIN cities c ON ts.city_id = c.city_id
      JOIN countries co ON c.country_id = co.country_id
      WHERE ts.stop_id = ?
    `;

    const results = await executeQuery(query, [stopId]);
    return results[0] || null;
  }

  static async update(stopId, updateData) {
    const allowedFields = [
      "city_id",
      "stop_order",
      "arrival_date",
      "departure_date",
      "accommodation_name",
      "accommodation_address",
      "accommodation_cost",
      "accommodation_booking_ref",
      "transportation_mode",
      "transportation_cost",
      "transportation_details",
      "notes",
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

    params.push(stopId);
    const query = `UPDATE trip_stops SET ${updates.join(
      ", "
    )} WHERE stop_id = ?`;
    await executeQuery(query, params);
  }

  static async delete(stopId) {
    const query = "DELETE FROM trip_stops WHERE stop_id = ?";
    await executeQuery(query, [stopId]);
  }

  static async reorderStops(tripId, stopOrders) {
    for (const { stopId, stopOrder } of stopOrders) {
      const query =
        "UPDATE trip_stops SET stop_order = ? WHERE stop_id = ? AND trip_id = ?";
      await executeQuery(query, [stopOrder, stopId, tripId]);
    }
  }
}

module.exports = TripStop;
