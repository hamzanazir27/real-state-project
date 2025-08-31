// server/routes/user.route.js
import express from "express";
import userControllers from "../controllers/user.controller.js";

const { test } = userControllers;
const router = express.Router();

router.get("/test", test);

export default router;
