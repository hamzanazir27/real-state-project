import authController from "../controllers/auth.controller.js";
import express from "express";
const { signup, signin, googleAuth } = authController;

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);

export default router;
