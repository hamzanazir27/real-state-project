import express from "express";
import mongoose from "mongoose";
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/mern-realstate")
  .then(() => console.log("db connected"))
  .catch((e) => console.log("error", e.message));

const PORT = 8000;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
