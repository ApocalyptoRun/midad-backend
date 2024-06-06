import express from "express";
import authController from "../controllers/authController.js";
import validateToken from "../middleware/validateTokenHandler.js";

export const router = express.Router();

/**
 * @swagger
 * '/auth/sendOTP':
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Send an OTP via SMS to given phoneNumber
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  phoneNumber:
 *                      type: string
 *                      description: The phone number to which OTP will be sent
 *              required:
 *                  - phoneNumber
 *     responses:
 *       200:
 *         description: One-Time Password sent successfully
 */
router.post("/sendOTP", authController.sendOTP);

/**
 * @swagger
 * '/auth/verifyOTP':
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Verify that otp matched the otp sent in sms and return user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  OTP:
 *                      type: string
 *                      description: The opt sent by sms
 *                  phoneNumber:
 *                      type: string
 *                      description: phone number who receive otp
 *              required:
 *                  - OTP
 *                  - phoneNumber
 *     responses:
 *       200:
 *         description: opt in sms matched existing otp
 */
router.post("/verifyOTP", authController.verifyOTP);

/**
 * @swagger
 * '/auth/signin':
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Signin a user by phoneNumber and return a token
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  phoneNumber:
 *                      type: string
 *                      description: user phone number to signin with
 *              required:
 *                  - phoneNumber
 *     responses:
 *       200:
 *         description: use signin successfully !
 */
router.post("/signin", authController.signin);

/**
 * @swagger
 * '/auth/authenticateToken':
 *   get:
 *     tags:
 *       - Authentification
 *     summary: validate a token and return decoded user 
 *     responses:
 *       200:
 *         description: Success !
 *     security:
 *       - bearerAuth: [] 
 */
router.get("/authenticateToken", validateToken, authController.authenticateToken);

