import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import listingRoute from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(" DB connected"))
  .catch((e) => console.log(" DB error:", e.message));

// Middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listing", listingRoute);

// Serve frontend build files
const clientDistPath = path.join(__dirname, "client", "dist");
app.use(express.static(clientDistPath));

// Catch-all route to serve index.html for React Router
app.get("/*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
