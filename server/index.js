import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js"; // extension add .js is mendatory

const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected"))
  .catch((e) => console.log("error", e.message));

// midleware
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

//middleware
// jb api endpoints next call kjrey gi tu idher aye gi
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internel server Error";
  return res.json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
