const app = require("./app");
const { testConnection } = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error(
        "Failed to connect to database. Please check your configuration."
      );
      process.exit(1);
    }

    // Start listening
    const server = app.listen(PORT, HOST, () => {
      console.log("=".repeat(50));
      console.log("🚀 GlobeTrotter API Server");
      console.log("=".repeat(50));
      console.log(`📍 Server running on: http://${HOST}:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`💾 Database: ${process.env.DB_NAME || "globetrotter"}`);
      console.log("=".repeat(50));
      console.log("📚 Available endpoints:");
      console.log(`   - Health Check: http://localhost:${PORT}/health`);
      console.log(`   - Auth API: http://localhost:${PORT}/api/auth`);
      console.log("=".repeat(50));
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error("Forcing shutdown...");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the server
startServer();
