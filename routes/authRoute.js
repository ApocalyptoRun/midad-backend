import express from "express";
import authController from "../controllers/authController.js";
import validateToken from "../middleware/validateTokenHandler.js";

export const router = express.Router();

router.post("/sendOTP", authController.sendOTP);
router.post("/verifyOTP", authController.verifyOTP);
router.post("/signin", authController.signin);

router.get("/authenticateToken", validateToken, authController.authenticateToken);

