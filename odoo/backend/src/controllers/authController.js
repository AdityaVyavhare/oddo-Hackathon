const User = require("../models/User");
const {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  generateUsername,
  comparePassword,
} = require("../utils/authUtils");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      phoneNumber,
      dateOfBirth,
      city,
      country,
      bio,
      nationality,
      preferredCurrency,
      preferredLanguage,
      profilePictureUrl,
    } = req.body;

    // Check if email already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return ApiResponse.conflict(res, "Email already exists");
    }

    // Generate username if not provided
    let finalUsername = username;
    if (!finalUsername) {
      finalUsername = generateUsername(email);

      // Ensure username is unique
      let usernameExists = await User.findByUsername(finalUsername);
      let counter = 1;
      while (usernameExists) {
        finalUsername = `${generateUsername(email)}_${counter}`;
        usernameExists = await User.findByUsername(finalUsername);
        counter++;
      }
    } else {
      // Check if provided username already exists
      const existingUsername = await User.findByUsername(finalUsername);
      if (existingUsername) {
        return ApiResponse.conflict(res, "Username already exists");
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Prepare user data
    const userData = {
      email,
      passwordHash,
      firstName,
      lastName,
      username: finalUsername,
      profilePictureUrl: profilePictureUrl || null,
      bio: bio || null,
      phoneNumber: phoneNumber || null,
      dateOfBirth: dateOfBirth || null,
      nationality: nationality || null,
      preferredCurrency: preferredCurrency || "USD",
      preferredLanguage: preferredLanguage || "en",
    };

    // Create user in database
    const userId = await User.create(userData);

    // Get created user data
    const newUser = await User.findById(userId);

    // Generate JWT tokens
    const tokenPayload = {
      userId: newUser.user_id,
      email: newUser.email,
      username: newUser.username,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Prepare response data
    const responseData = {
      user: {
        userId: newUser.user_id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        profilePictureUrl: newUser.profile_picture_url,
        bio: newUser.bio,
        phoneNumber: newUser.phone_number,
        dateOfBirth: newUser.date_of_birth,
        nationality: newUser.nationality,
        preferredCurrency: newUser.preferred_currency,
        preferredLanguage: newUser.preferred_language,
        isActive: newUser.is_active,
        createdAt: newUser.created_at,
      },
      token: accessToken,
      refreshToken: refreshToken,
      expiresIn: 3600, // 1 hour in seconds
    };

    return ApiResponse.success(
      res,
      201,
      "Registration successful",
      responseData
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific database errors
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("email")) {
        return ApiResponse.conflict(res, "Email already exists");
      }
      if (error.message.includes("username")) {
        return ApiResponse.conflict(res, "Username already exists");
      }
    }

    return ApiResponse.serverError(
      res,
      "Registration failed. Please try again later."
    );
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 * @desc Login with email or username
 */
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Determine if identifier is email or username
    const isEmail = identifier.includes("@");

    // Find user by email or username
    let user;
    if (isEmail) {
      user = await User.findByEmail(identifier);
    } else {
      user = await User.findByUsername(identifier);
    }

    if (!user) {
      return ApiResponse.unauthorized(res, "Invalid credentials");
    }

    // Check if user is active
    if (!user.is_active) {
      return ApiResponse.forbidden(
        res,
        "Account is deactivated. Please contact support."
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return ApiResponse.unauthorized(res, "Invalid credentials");
    }

    // Update last login timestamp
    await User.updateLastLogin(user.user_id);

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.user_id,
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Prepare response data
    const responseData = {
      user: {
        userId: user.user_id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        profilePictureUrl: user.profile_picture_url,
        bio: user.bio,
        phoneNumber: user.phone_number,
        dateOfBirth: user.date_of_birth,
        nationality: user.nationality,
        preferredCurrency: user.preferred_currency,
        preferredLanguage: user.preferred_language,
        isActive: user.is_active,
        isPremium: user.is_premium,
        totalTripsCreated: user.total_trips_created,
        totalCountriesVisited: user.total_countries_visited,
        lastLoginAt: user.last_login_at,
      },
      token: accessToken,
      refreshToken: refreshToken,
      expiresIn: 3600,
    };

    return ApiResponse.success(res, 200, "Login successful", responseData);
  } catch (error) {
    console.error("Login error:", error);
    return ApiResponse.serverError(
      res,
      "Login failed. Please try again later."
    );
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private (requires authentication)
 */
const getCurrentUser = async (req, res) => {
  try {
    // User ID will be attached to req by auth middleware
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    const userData = {
      userId: user.user_id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePictureUrl: user.profile_picture_url,
      bio: user.bio,
      phoneNumber: user.phone_number,
      dateOfBirth: user.date_of_birth,
      nationality: user.nationality,
      preferredCurrency: user.preferred_currency,
      preferredLanguage: user.preferred_language,
      isActive: user.is_active,
      isPremium: user.is_premium,
      totalTripsCreated: user.total_trips_created,
      totalCountriesVisited: user.total_countries_visited,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
    };

    return ApiResponse.success(
      res,
      200,
      "User profile retrieved successfully",
      userData
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve user profile");
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
