import authController from "../controllers/auth.controller.js";
import express from "express";
const { signup, signin, googleAuth, signout } = authController;

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);
router.post("/signout", signout);

export default router;
