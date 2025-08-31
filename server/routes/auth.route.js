import authController from "../controllers/auth.controller.js";
import express from "express";
const { signup } = authController;

const router = express.Router();

router.post("/signup", signup);

export default router;
