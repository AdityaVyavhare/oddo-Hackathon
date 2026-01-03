const db = require("../config/database");

class Document {
  /**
   * Upload document
   */
  static async create(
    tripId,
    userId,
    documentName,
    documentType,
    fileUrl,
    fileSize
  ) {
    const query = `
      INSERT INTO trip_documents (trip_id, user_id, document_name, document_type, file_url, file_size)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      tripId,
      userId,
      documentName,
      documentType,
      fileUrl,
      fileSize,
    ]);
    return result.insertId;
  }

  /**
   * Get trip documents
   */
  static async getTripDocuments(tripId) {
    const query = `
      SELECT 
        td.document_id,
        td.document_name,
        td.document_type,
        td.file_url,
        td.file_size,
        td.uploaded_at,
        u.user_id,
        u.username,
        u.full_name
      FROM trip_documents td
      JOIN users u ON td.user_id = u.user_id
      WHERE td.trip_id = ?
      ORDER BY td.uploaded_at DESC
    `;
    const [documents] = await db.execute(query, [tripId]);
    return documents;
  }

  /**
   * Get document by ID
   */
  static async findById(documentId) {
    const query = `SELECT * FROM trip_documents WHERE document_id = ?`;
    const [rows] = await db.execute(query, [documentId]);
    return rows[0];
  }

  /**
   * Update document
   */
  static async update(documentId, documentName, documentType) {
    const query = `
      UPDATE trip_documents
      SET document_name = ?, document_type = ?
      WHERE document_id = ?
    `;
    const [result] = await db.execute(query, [
      documentName,
      documentType,
      documentId,
    ]);
    return result;
  }

  /**
   * Delete document
   */
  static async delete(documentId) {
    const query = `DELETE FROM trip_documents WHERE document_id = ?`;
    const [result] = await db.execute(query, [documentId]);
    return result;
  }
}

class Checklist {
  /**
   * Get packing checklist for trip
   */
  static async getPackingChecklist(tripId) {
    const query = `
      SELECT 
        checklist_id,
        item_name,
        category,
        is_checked,
        created_at
      FROM packing_checklist
      WHERE trip_id = ?
      ORDER BY category, item_name
    `;
    const [items] = await db.execute(query, [tripId]);
    return items;
  }

  /**
   * Add checklist item
   */
  static async addItem(tripId, itemName, category) {
    const query = `
      INSERT INTO packing_checklist (trip_id, item_name, category)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(query, [tripId, itemName, category]);
    return result.insertId;
  }

  /**
   * Toggle checklist item
   */
  static async toggleItem(checklistId, isChecked) {
    const query = `
      UPDATE packing_checklist
      SET is_checked = ?
      WHERE checklist_id = ?
    `;
    const [result] = await db.execute(query, [isChecked, checklistId]);
    return result;
  }

  /**
   * Delete checklist item
   */
  static async deleteItem(checklistId) {
    const query = `DELETE FROM packing_checklist WHERE checklist_id = ?`;
    const [result] = await db.execute(query, [checklistId]);
    return result;
  }

  /**
   * Get item by ID
   */
  static async findById(checklistId) {
    const query = `SELECT * FROM packing_checklist WHERE checklist_id = ?`;
    const [rows] = await db.execute(query, [checklistId]);
    return rows[0];
  }
}

module.exports = { Document, Checklist };
