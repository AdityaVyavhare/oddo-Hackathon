/**
 * API Configuration and Base Client
 * Centralized API communication for GlobeTrotter frontend
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

/**
 * Set authentication token to localStorage
 */
const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

/**
 * Remove authentication token from localStorage
 */
const removeAuthToken = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUserId");
};

/**
 * Base API request function with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // If FormData, remove Content-Type header (browser will set it with boundary)
  if (options.body instanceof FormData) {
    delete defaultHeaders["Content-Type"];
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Parse JSON response
    const data = await response.json();

    if (!response.ok) {
      // Handle API errors
      throw {
        status: response.status,
        message: data.message || "An error occurred",
        errors: data.errors || [],
        data: data,
      };
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.status) {
      throw error;
    }

    throw {
      status: 0,
      message: "Network error. Please check your connection.",
      errors: [],
    };
  }
};

/**
 * GET request
 */
const get = (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  return apiRequest(url, {
    method: "GET",
  });
};

/**
 * POST request
 */
const post = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
};

/**
 * PUT request
 */
const put = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: "PUT",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
};

/**
 * PATCH request
 */
const patch = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 */
const deleteRequest = (endpoint, data = null) => {
  return apiRequest(endpoint, {
    method: "DELETE",
    ...(data && { body: JSON.stringify(data) }),
  });
};

export default {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
};
