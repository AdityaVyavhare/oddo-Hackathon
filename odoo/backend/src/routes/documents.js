const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { documentUpload } = require("../middleware/documentUploadMiddleware");
const {
  getTripDocuments,
  uploadDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  getPackingChecklist,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
} = require("../controllers/documentController");

// Document routes
router.get("/trips/:tripId/documents", getTripDocuments);
router.post(
  "/trips/:tripId/documents",
  authMiddleware,
  documentUpload.single("document"),
  uploadDocument
);
router.get("/documents/:documentId", getDocument);
router.put("/documents/:documentId", authMiddleware, updateDocument);
router.delete("/documents/:documentId", authMiddleware, deleteDocument);

// Packing checklist routes
router.get("/trips/:tripId/checklist", getPackingChecklist);
router.post("/trips/:tripId/checklist", authMiddleware, addChecklistItem);
router.patch("/checklist/:checklistId", authMiddleware, toggleChecklistItem);
router.delete("/checklist/:checklistId", authMiddleware, deleteChecklistItem);

module.exports = router;
