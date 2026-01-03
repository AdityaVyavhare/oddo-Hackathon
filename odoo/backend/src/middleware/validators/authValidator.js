const { body, validationResult } = require("express-validator");
const ApiResponse = require("../../utils/ApiResponse");

/**
 * Registration validation rules
 */
const registerValidation = [
  // Email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("Email must not exceed 255 characters"),

  // Password validation
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  // Confirm password validation
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  // First name validation
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("First name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  // Last name validation
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Last name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  // Username validation (optional, will be generated if not provided)
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  // Phone number validation (optional)
  body("phoneNumber")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Invalid phone number format (E.164 format required)"),

  // Date of birth validation (optional)
  body("dateOfBirth")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("Invalid date format")
    .custom((value) => {
      const age = Math.floor((new Date() - new Date(value)) / 31557600000);
      if (age < 13) {
        throw new Error("You must be at least 13 years old to register");
      }
      if (age > 120) {
        throw new Error("Invalid date of birth");
      }
      return true;
    }),

  // City validation (optional)
  body("city")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage("City name must not exceed 150 characters"),

  // Country validation (optional)
  body("country")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country name must not exceed 100 characters"),

  // Bio validation (optional)
  body("bio")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters"),

  // Nationality validation (optional)
  body("nationality")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Nationality must not exceed 100 characters"),

  // Preferred currency validation (optional)
  body("preferredCurrency")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency code must be 3 characters")
    .isUppercase()
    .withMessage("Currency code must be uppercase"),

  // Preferred language validation (optional)
  body("preferredLanguage")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage("Language code must be between 2 and 10 characters"),

  // Terms acceptance validation
  body("acceptedTerms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions")
    .isBoolean()
    .withMessage("Invalid value for terms acceptance")
    .custom((value) => value === true || value === "true")
    .withMessage("You must accept the terms and conditions"),

  // Privacy acceptance validation
  body("acceptedPrivacy")
    .notEmpty()
    .withMessage("You must accept the privacy policy")
    .isBoolean()
    .withMessage("Invalid value for privacy acceptance")
    .custom((value) => value === true || value === "true")
    .withMessage("You must accept the privacy policy"),
];

/**
 * Login validation rules
 */
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    return ApiResponse.validationError(res, formattedErrors);
  }

  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  handleValidationErrors,
};
