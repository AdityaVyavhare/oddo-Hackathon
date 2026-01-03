/**
 * Wishlist API Service
 */

import api from "./api";

/**
 * Get user wishlist
 * @returns {Promise} API response with wishlist items
 */
export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data.wishlist;
};

/**
 * Add item to wishlist
 * @param {Object} itemData - Wishlist item data
 * @returns {Promise} API response
 */
export const addToWishlist = async (itemData) => {
  const response = await api.post("/wishlist", itemData);
  return response.data.wishlistItem;
};

/**
 * Remove item from wishlist
 * @param {number} wishlistId - Wishlist item ID
 * @returns {Promise} API response
 */
export const removeFromWishlist = async (wishlistId) => {
  const response = await api.delete(`/wishlist/${wishlistId}`);
  return response;
};

/**
 * Update wishlist item
 * @param {number} wishlistId - Wishlist item ID
 * @param {Object} updates - Item updates
 * @returns {Promise} API response
 */
export const updateWishlistItem = async (wishlistId, updates) => {
  const response = await api.put(`/wishlist/${wishlistId}`, updates);
  return response.data.wishlistItem;
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateWishlistItem,
};
