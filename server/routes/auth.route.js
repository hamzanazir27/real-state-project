import authController from "../controllers/auth.controller.js";
import express from "express";
const { signup, signin } = authController;

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
