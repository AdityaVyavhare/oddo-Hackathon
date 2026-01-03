const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const ApiResponse = require("../utils/ApiResponse");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads/profiles");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, and WebP images are allowed"
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

// Middleware to handle single profile picture upload
const uploadProfilePicture = upload.single("profilePicture");

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return ApiResponse.error(
        res,
        400,
        "File size too large. Maximum size is 5MB"
      );
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return ApiResponse.error(res, 400, "Unexpected file field");
    }
    return ApiResponse.error(res, 400, err.message);
  } else if (err) {
    return ApiResponse.error(res, 400, err.message);
  }
  next();
};

// Middleware to process uploaded file
const processUploadedFile = (req, res, next) => {
  if (req.file) {
    // Generate URL for uploaded file
    req.body.profilePictureUrl = `/uploads/profiles/${req.file.filename}`;
  }
  next();
};

module.exports = {
  uploadProfilePicture,
  handleUploadError,
  processUploadedFile,
};
