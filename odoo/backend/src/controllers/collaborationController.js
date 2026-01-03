const Collaboration = require("../models/Collaboration");
const Trip = require("../models/Trip");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Get trip collaborators
 */
const getTripCollaborators = async (req, res) => {
  try {
    const { tripId } = req.params;

    const collaborators = await Collaboration.getTripCollaborators(tripId);
    return ApiResponse.success(
      res,
      collaborators,
      "Collaborators retrieved successfully"
    );
  } catch (error) {
    console.error("Get collaborators error:", error);
    return ApiResponse.error(res, "Failed to retrieve collaborators", 500);
  }
};

/**
 * Add collaborator to trip
 */
const addCollaborator = async (req, res) => {
  try {
    const { tripId } = req.params;
    const ownerId = req.user.userId;
    const { userId, permissions } = req.body;

    if (!userId) {
      return ApiResponse.error(res, "User ID is required", 400);
    }

    // Verify trip ownership
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return ApiResponse.error(res, "Trip not found", 404);
    }

    if (trip.user_id !== ownerId) {
      return ApiResponse.error(
        res,
        "Only trip owner can add collaborators",
        403
      );
    }

    // Cannot add owner as collaborator
    if (parseInt(userId) === ownerId) {
      return ApiResponse.error(
        res,
        "Cannot add trip owner as collaborator",
        400
      );
    }

    // Check if already collaborator
    const existing = await Collaboration.isCollaborator(tripId, userId);
    if (existing) {
      return ApiResponse.error(res, "User is already a collaborator", 400);
    }

    const validPermissions = ["view", "edit"];
    const permissionLevel = validPermissions.includes(permissions)
      ? permissions
      : "view";

    const collaboratorId = await Collaboration.addCollaborator(
      tripId,
      userId,
      permissionLevel
    );
    return ApiResponse.success(
      res,
      { collaboratorId, userId, permissions: permissionLevel },
      "Collaborator added successfully",
      201
    );
  } catch (error) {
    console.error("Add collaborator error:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return ApiResponse.error(res, "User not found", 404);
    }
    return ApiResponse.error(res, "Failed to add collaborator", 500);
  }
};

/**
 * Remove collaborator from trip
 */
const removeCollaborator = async (req, res) => {
  try {
    const { tripId, userId } = req.params;
    const ownerId = req.user.userId;

    // Verify trip ownership
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return ApiResponse.error(res, "Trip not found", 404);
    }

    if (trip.user_id !== ownerId) {
      return ApiResponse.error(
        res,
        "Only trip owner can remove collaborators",
        403
      );
    }

    const result = await Collaboration.removeCollaborator(tripId, userId);

    if (result.affectedRows === 0) {
      return ApiResponse.error(res, "Collaborator not found", 404);
    }

    return ApiResponse.success(res, null, "Collaborator removed successfully");
  } catch (error) {
    console.error("Remove collaborator error:", error);
    return ApiResponse.error(res, "Failed to remove collaborator", 500);
  }
};

/**
 * Update collaborator permissions
 */
const updateCollaboratorPermissions = async (req, res) => {
  try {
    const { tripId, userId } = req.params;
    const ownerId = req.user.userId;
    const { permissions } = req.body;

    if (!permissions) {
      return ApiResponse.error(res, "Permissions field is required", 400);
    }

    const validPermissions = ["view", "edit"];
    if (!validPermissions.includes(permissions)) {
      return ApiResponse.error(
        res,
        "Invalid permissions. Use 'view' or 'edit'",
        400
      );
    }

    // Verify trip ownership
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return ApiResponse.error(res, "Trip not found", 404);
    }

    if (trip.user_id !== ownerId) {
      return ApiResponse.error(
        res,
        "Only trip owner can update permissions",
        403
      );
    }

    const result = await Collaboration.updatePermissions(
      tripId,
      userId,
      permissions
    );

    if (result.affectedRows === 0) {
      return ApiResponse.error(res, "Collaborator not found", 404);
    }

    return ApiResponse.success(
      res,
      { userId, permissions },
      "Permissions updated successfully"
    );
  } catch (error) {
    console.error("Update permissions error:", error);
    return ApiResponse.error(res, "Failed to update permissions", 500);
  }
};

/**
 * Send trip invitation
 */
const sendTripInvitation = async (req, res) => {
  try {
    const { tripId } = req.params;
    const invitedBy = req.user.userId;
    const { email, permissions } = req.body;

    if (!email) {
      return ApiResponse.error(res, "Email is required", 400);
    }

    // Verify trip ownership
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return ApiResponse.error(res, "Trip not found", 404);
    }

    if (trip.user_id !== invitedBy) {
      return ApiResponse.error(
        res,
        "Only trip owner can send invitations",
        403
      );
    }

    const validPermissions = ["view", "edit"];
    const permissionLevel = validPermissions.includes(permissions)
      ? permissions
      : "view";

    const invitation = await Collaboration.createInvitation(
      tripId,
      invitedBy,
      email,
      permissionLevel
    );

    return ApiResponse.success(
      res,
      {
        invitationId: invitation.invitationId,
        token: invitation.token,
        expiresAt: invitation.expiresAt,
        invitationLink: `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/invitations/${invitation.token}`,
      },
      "Invitation sent successfully",
      201
    );
  } catch (error) {
    console.error("Send invitation error:", error);
    return ApiResponse.error(res, "Failed to send invitation", 500);
  }
};

module.exports = {
  getTripCollaborators,
  addCollaborator,
  removeCollaborator,
  updateCollaboratorPermissions,
  sendTripInvitation,
};
