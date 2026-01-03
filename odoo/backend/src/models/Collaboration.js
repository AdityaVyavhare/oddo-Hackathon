const db = require("../config/database");

class Collaboration {
  /**
   * Add collaborator to trip
   */
  static async addCollaborator(tripId, userId, permissions = "view") {
    const query = `
      INSERT INTO trip_collaborators (trip_id, user_id, permissions)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(query, [tripId, userId, permissions]);
    return result.insertId;
  }

  /**
   * Remove collaborator from trip
   */
  static async removeCollaborator(tripId, userId) {
    const query = `
      DELETE FROM trip_collaborators
      WHERE trip_id = ? AND user_id = ?
    `;
    const [result] = await db.execute(query, [tripId, userId]);
    return result;
  }

  /**
   * Get trip collaborators
   */
  static async getTripCollaborators(tripId) {
    const query = `
      SELECT 
        tc.collaborator_id,
        tc.user_id,
        tc.permissions,
        tc.added_at,
        u.username,
        u.full_name,
        u.profile_picture,
        u.email
      FROM trip_collaborators tc
      JOIN users u ON tc.user_id = u.user_id
      WHERE tc.trip_id = ?
      ORDER BY tc.added_at ASC
    `;
    const [collaborators] = await db.execute(query, [tripId]);
    return collaborators;
  }

  /**
   * Check if user is collaborator
   */
  static async isCollaborator(tripId, userId) {
    const query = `
      SELECT permissions 
      FROM trip_collaborators
      WHERE trip_id = ? AND user_id = ?
    `;
    const [rows] = await db.execute(query, [tripId, userId]);
    return rows[0] || null;
  }

  /**
   * Update collaborator permissions
   */
  static async updatePermissions(tripId, userId, permissions) {
    const query = `
      UPDATE trip_collaborators
      SET permissions = ?
      WHERE trip_id = ? AND user_id = ?
    `;
    const [result] = await db.execute(query, [permissions, tripId, userId]);
    return result;
  }

  /**
   * Create trip invitation
   */
  static async createInvitation(
    tripId,
    invitedBy,
    invitedEmail,
    permissions = "view"
  ) {
    // Generate unique invitation token
    const token = require("crypto").randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const query = `
      INSERT INTO trip_invitations (trip_id, invited_by, invited_email, invitation_token, permissions, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      tripId,
      invitedBy,
      invitedEmail,
      token,
      permissions,
      expiresAt,
    ]);

    return {
      invitationId: result.insertId,
      token,
      expiresAt,
    };
  }

  /**
   * Get invitation by token
   */
  static async getInvitationByToken(token) {
    const query = `
      SELECT 
        ti.*,
        t.trip_name,
        t.description,
        t.cover_image,
        u.username as invited_by_username,
        u.full_name as invited_by_name
      FROM trip_invitations ti
      JOIN trips t ON ti.trip_id = t.trip_id
      JOIN users u ON ti.invited_by = u.user_id
      WHERE ti.invitation_token = ?
        AND ti.status = 'pending'
        AND ti.expires_at > NOW()
    `;
    const [rows] = await db.execute(query, [token]);
    return rows[0];
  }

  /**
   * Accept invitation
   */
  static async acceptInvitation(invitationId, userId) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Get invitation details
      const [invitations] = await conn.execute(
        `SELECT trip_id, permissions FROM trip_invitations WHERE invitation_id = ?`,
        [invitationId]
      );

      if (!invitations[0]) {
        throw new Error("Invitation not found");
      }

      const { trip_id, permissions } = invitations[0];

      // Add as collaborator
      await conn.execute(
        `INSERT INTO trip_collaborators (trip_id, user_id, permissions) VALUES (?, ?, ?)`,
        [trip_id, userId, permissions]
      );

      // Update invitation status
      await conn.execute(
        `UPDATE trip_invitations SET status = 'accepted' WHERE invitation_id = ?`,
        [invitationId]
      );

      await conn.commit();
      return { tripId: trip_id, permissions };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Decline invitation
   */
  static async declineInvitation(invitationId) {
    const query = `
      UPDATE trip_invitations
      SET status = 'declined'
      WHERE invitation_id = ?
    `;
    const [result] = await db.execute(query, [invitationId]);
    return result;
  }

  /**
   * Get user's pending invitations
   */
  static async getUserInvitations(email) {
    const query = `
      SELECT 
        ti.invitation_id,
        ti.invitation_token,
        ti.permissions,
        ti.created_at,
        ti.expires_at,
        t.trip_id,
        t.trip_name,
        t.description,
        t.cover_image,
        u.username as invited_by_username,
        u.full_name as invited_by_name
      FROM trip_invitations ti
      JOIN trips t ON ti.trip_id = t.trip_id
      JOIN users u ON ti.invited_by = u.user_id
      WHERE ti.invited_email = ?
        AND ti.status = 'pending'
        AND ti.expires_at > NOW()
      ORDER BY ti.created_at DESC
    `;
    const [invitations] = await db.execute(query, [email]);
    return invitations;
  }
}

module.exports = Collaboration;
