/**
 * Social API Service (Following, Followers, etc.)
 */

import api from "./api";

/**
 * Follow a user
 * @param {number} userId - User ID to follow
 * @returns {Promise} API response
 */
export const followUser = async (userId) => {
  const response = await api.post(`/social/follow/${userId}`);
  return response;
};

/**
 * Unfollow a user
 * @param {number} userId - User ID to unfollow
 * @returns {Promise} API response
 */
export const unfollowUser = async (userId) => {
  const response = await api.delete(`/social/follow/${userId}`);
  return response;
};

/**
 * Get user followers
 * @param {number} userId - User ID
 * @returns {Promise} API response with followers
 */
export const getFollowers = async (userId) => {
  const response = await api.get(`/social/followers/${userId}`);
  return response.data.followers;
};

/**
 * Get user following
 * @param {number} userId - User ID
 * @returns {Promise} API response with following
 */
export const getFollowing = async (userId) => {
  const response = await api.get(`/social/following/${userId}`);
  return response.data.following;
};

/**
 * Get social feed
 * @returns {Promise} API response with feed
 */
export const getSocialFeed = async () => {
  const response = await api.get("/social/feed");
  return response.data.feed;
};

export default {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getSocialFeed,
};
