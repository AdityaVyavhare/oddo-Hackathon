const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTripCollaborators,
  addCollaborator,
  removeCollaborator,
  updateCollaboratorPermissions,
  sendTripInvitation,
} = require("../controllers/collaborationController");

// All collaboration routes require authentication
router.use(authMiddleware);

// Collaborator management
router.get("/trips/:tripId/collaborators", getTripCollaborators);
router.post("/trips/:tripId/collaborators", addCollaborator);
router.delete("/trips/:tripId/collaborators/:userId", removeCollaborator);
router.patch(
  "/trips/:tripId/collaborators/:userId/permissions",
  updateCollaboratorPermissions
);

// Invitations
router.post("/trips/:tripId/invite", sendTripInvitation);

module.exports = router;
