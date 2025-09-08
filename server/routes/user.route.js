// server/routes/user.route.js
import express from "express";
import userControllers from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const { test, updateUser } = userControllers;
const router = express.Router();

router.get("/test", test);
router.patch("/update/:id", verifyToken, updateUser);
export default router;
