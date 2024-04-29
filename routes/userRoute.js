import express from "express";
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateTokenHandler.js";
import upload from '../middleware/multer-config.js';

export const router = express.Router();


/**
 * @swagger
 * '/user/users':
 *   get:
 *     tags:
 *       - User
 *     summary: get all user except logged in user
 *     responses:
 *       200:
 *         description: Success !
 *     security:
 *       - bearerAuth: [] 
 */
router.get("/users", validateToken, userController.getUsers);


/**
 * @swagger
 * '/user/compareContacts':
 *   post:
 *     tags:
 *       - User
 *     summary: Compare phone contacts and user phone number in mongoDB and return user whom phone number macth.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  phoneContacts:
 *                      type: array
 *                      items:
 *                         type: string
 *                      description: phone contacts
 *              required:
 *                  - phoneContacts
 *     responses:
 *       200:
 *         description: Success !
 *     security:
 *       - bearerAuth: [] 
 */
router.post("/compareContacts", validateToken, userController.compareContacts);


/**
 * @swagger
 * '/user/updateProfile':
 *   put:
 *     tags:
 *       - User
 *     summary: update user profile if first authentification
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  firstName:
 *                      type: string
 *                      description: user firstname
 *              required:
 *                  - firstName
 *     responses:
 *       200:
 *         description: Success !
 *     security:
 *       - bearerAuth: [] 
 */
router.put("/updateProfile", validateToken, upload.single("file"), userController.updateUserProfile);
