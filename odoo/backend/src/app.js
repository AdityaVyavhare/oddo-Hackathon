const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const path = require("path");
require("dotenv").config();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Compression middleware
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/countries", require("./routes/countries"));
app.use("/api/cities", require("./routes/cities"));
app.use("/api/activities", require("./routes/activities"));
app.use("/api/trips", require("./routes/trips"));
app.use("/api/expense-categories", require("./routes/expenseCategories"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/social", require("./routes/social"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/search", require("./routes/search"));
app.use("/api/collaboration", require("./routes/collaboration"));
app.use("/api/documents", require("./routes/documents"));
app.use("/api/admin", require("./routes/admin"));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to GlobeTrotter API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      countries: "/api/countries",
      cities: "/api/cities",
      activities: "/api/activities",
      trips: "/api/trips",
      expenseCategories: "/api/expense-categories",
      wishlist: "/api/wishlist",
      social: "/api/social",
      notifications: "/api/notifications",
      search: "/api/search",
      collaboration: "/api/collaboration",
      documents: "/api/documents",
      admin: "/api/admin",
      health: "/health",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

module.exports = app;
