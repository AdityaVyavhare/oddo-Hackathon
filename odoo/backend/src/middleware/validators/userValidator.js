const { body, param } = require("express-validator");

/**
 * Update profile validation rules
 */
const updateProfileValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("First name must be between 2 and 100 characters")
    .matches(/^[A-Za-z\s'-]+$/)
    .withMessage(
      "First name can only contain letters, spaces, hyphens and apostrophes"
    ),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Last name must be between 2 and 100 characters")
    .matches(/^[A-Za-z\s'-]+$/)
    .withMessage(
      "Last name can only contain letters, spaces, hyphens and apostrophes"
    ),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters"),

  body("phoneNumber")
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Phone number must be in E.164 format (e.g., +1234567890)"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date (YYYY-MM-DD)")
    .custom((value) => {
      const age = Math.floor(
        (new Date() - new Date(value).getTime()) / 3.15576e10
      );
      if (age < 13) {
        throw new Error("You must be at least 13 years old");
      }
      return true;
    }),

  body("nationality")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Nationality must not exceed 100 characters"),
];

/**
 * Update preferences validation rules
 */
const updatePreferencesValidation = [
  body("preferredCurrency")
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency code must be exactly 3 characters")
    .isUppercase()
    .withMessage("Currency code must be uppercase"),

  body("preferredLanguage")
    .optional()
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage("Language code must be between 2 and 10 characters"),
];

/**
 * Change password validation rules
 */
const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

/**
 * Delete account validation rules
 */
const deleteAccountValidation = [
  body("password")
    .notEmpty()
    .withMessage("Password is required to delete account"),
];

/**
 * User ID param validation
 */
const userIdParamValidation = [
  param("userId").isInt({ min: 1 }).withMessage("Invalid user ID"),
];

module.exports = {
  updateProfileValidation,
  updatePreferencesValidation,
  changePasswordValidation,
  deleteAccountValidation,
  userIdParamValidation,
};
