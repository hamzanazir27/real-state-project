import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js"; // extension add karo

const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected"))
  .catch((e) => console.log("error", e.message));

app.use("/api/users", userRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
