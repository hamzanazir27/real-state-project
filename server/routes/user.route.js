// server/routes/user.route.js
import express from "express";
import userControllers from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const { test, updateUser, deleteUser } = userControllers;
const router = express.Router();

router.get("/test", test);
router.patch("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
export default router;
