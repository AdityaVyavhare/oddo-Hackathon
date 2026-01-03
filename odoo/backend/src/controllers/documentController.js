const { Document, Checklist } = require("../models/Document");
const Trip = require("../models/Trip");
const ApiResponse = require("../utils/ApiResponse");
const path = require("path");
const fs = require("fs");

/**
 * Get trip documents
 */
const getTripDocuments = async (req, res) => {
  try {
    const { tripId } = req.params;

    const documents = await Document.getTripDocuments(tripId);
    return ApiResponse.success(
      res,
      documents,
      "Documents retrieved successfully"
    );
  } catch (error) {
    console.error("Get trip documents error:", error);
    return ApiResponse.error(res, "Failed to retrieve documents", 500);
  }
};

/**
 * Upload document
 */
const uploadDocument = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;
    const { documentName, documentType } = req.body;

    if (!req.file) {
      return ApiResponse.error(res, "No file uploaded", 400);
    }

    // Verify trip exists and user has access
    const trip = await Trip.findById(tripId);
    if (!trip) {
      // Delete uploaded file if trip not found
      fs.unlinkSync(req.file.path);
      return ApiResponse.error(res, "Trip not found", 404);
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;
    const fileSize = req.file.size;

    const documentId = await Document.create(
      tripId,
      userId,
      documentName || req.file.originalname,
      documentType || "other",
      fileUrl,
      fileSize
    );

    return ApiResponse.success(
      res,
      {
        documentId,
        documentName: documentName || req.file.originalname,
        documentType: documentType || "other",
        fileUrl,
        fileSize,
      },
      "Document uploaded successfully",
      201
    );
  } catch (error) {
    console.error("Upload document error:", error);
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return ApiResponse.error(res, "Failed to upload document", 500);
  }
};

/**
 * Download/view document
 */
const getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return ApiResponse.error(res, "Document not found", 404);
    }

    const filePath = path.join(__dirname, "../../", document.file_url);

    if (!fs.existsSync(filePath)) {
      return ApiResponse.error(res, "File not found on server", 404);
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("Get document error:", error);
    return ApiResponse.error(res, "Failed to retrieve document", 500);
  }
};

/**
 * Update document metadata
 */
const updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.userId;
    const { documentName, documentType } = req.body;

    const document = await Document.findById(documentId);
    if (!document) {
      return ApiResponse.error(res, "Document not found", 404);
    }

    // Verify user owns the document
    if (document.user_id !== userId) {
      return ApiResponse.error(
        res,
        "You can only update your own documents",
        403
      );
    }

    await Document.update(documentId, documentName, documentType);
    return ApiResponse.success(
      res,
      { documentId, documentName, documentType },
      "Document updated successfully"
    );
  } catch (error) {
    console.error("Update document error:", error);
    return ApiResponse.error(res, "Failed to update document", 500);
  }
};

/**
 * Delete document
 */
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.userId;

    const document = await Document.findById(documentId);
    if (!document) {
      return ApiResponse.error(res, "Document not found", 404);
    }

    // Verify user owns the document
    if (document.user_id !== userId) {
      return ApiResponse.error(
        res,
        "You can only delete your own documents",
        403
      );
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, "../../", document.file_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Document.delete(documentId);
    return ApiResponse.success(res, null, "Document deleted successfully");
  } catch (error) {
    console.error("Delete document error:", error);
    return ApiResponse.error(res, "Failed to delete document", 500);
  }
};

/**
 * Get packing checklist
 */
const getPackingChecklist = async (req, res) => {
  try {
    const { tripId } = req.params;

    const items = await Checklist.getPackingChecklist(tripId);
    return ApiResponse.success(
      res,
      items,
      "Packing checklist retrieved successfully"
    );
  } catch (error) {
    console.error("Get packing checklist error:", error);
    return ApiResponse.error(res, "Failed to retrieve packing checklist", 500);
  }
};

/**
 * Add checklist item
 */
const addChecklistItem = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { itemName, category } = req.body;

    if (!itemName) {
      return ApiResponse.error(res, "Item name is required", 400);
    }

    const itemId = await Checklist.addItem(
      tripId,
      itemName,
      category || "general"
    );
    return ApiResponse.success(
      res,
      { checklistId: itemId, itemName, category: category || "general" },
      "Checklist item added successfully",
      201
    );
  } catch (error) {
    console.error("Add checklist item error:", error);
    return ApiResponse.error(res, "Failed to add checklist item", 500);
  }
};

/**
 * Toggle checklist item
 */
const toggleChecklistItem = async (req, res) => {
  try {
    const { checklistId } = req.params;
    const { isChecked } = req.body;

    if (typeof isChecked !== "boolean") {
      return ApiResponse.error(res, "isChecked must be a boolean", 400);
    }

    const item = await Checklist.findById(checklistId);
    if (!item) {
      return ApiResponse.error(res, "Checklist item not found", 404);
    }

    await Checklist.toggleItem(checklistId, isChecked);
    return ApiResponse.success(
      res,
      { checklistId, isChecked },
      "Checklist item updated"
    );
  } catch (error) {
    console.error("Toggle checklist item error:", error);
    return ApiResponse.error(res, "Failed to update checklist item", 500);
  }
};

/**
 * Delete checklist item
 */
const deleteChecklistItem = async (req, res) => {
  try {
    const { checklistId } = req.params;

    const item = await Checklist.findById(checklistId);
    if (!item) {
      return ApiResponse.error(res, "Checklist item not found", 404);
    }

    await Checklist.deleteItem(checklistId);
    return ApiResponse.success(
      res,
      null,
      "Checklist item deleted successfully"
    );
  } catch (error) {
    console.error("Delete checklist item error:", error);
    return ApiResponse.error(res, "Failed to delete checklist item", 500);
  }
};

module.exports = {
  getTripDocuments,
  uploadDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  getPackingChecklist,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
};
