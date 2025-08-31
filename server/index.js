import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const app = express();
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected"))
  .catch((e) => console.log("error", e.message));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
