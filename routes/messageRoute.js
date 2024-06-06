import express from 'express';
import messageController from '../controllers/messageController.js';
import validateToken from '../middleware/validateTokenHandler.js';
import upload from '../middleware/multer-config.js';

export const router = express.Router();

router.post("/getLastMessage", validateToken, messageController.getLastMessage);

/**
 * @swagger
 * '/message/addMessage':
 *   post:
 *     tags:
 *       - Message
 *     summary: add a message swicht a type
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  senderId:
 *                      type: string
 *                      description: the id of the loggedin user
 *                  recepientId:
 *                      type: string
 *                      description: the id of the recepient
 *                  messageType:
 *                      type: string
 *                      description: type of the message
 *                  messageText:
 *                      type: string
 *                      description: message text in type equal text
 *              required:
 *                  - senderId
 *                  - recepientId
 *                  - messageType
 *     responses:
 *       200:
 *         description: message added successfully
 *     security:
 *       - bearerAuth: [] 
 */
router.post("/addMessage", validateToken, upload.single("file"), messageController.addMessage);


/**
 * @swagger
 * '/message/messages':
 *   post:
 *     tags:
 *       - Message
 *     summary: get all messages in a chat
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  senderId:
 *                      type: string
 *                      description: the id of the loggedin user
 *                  recepientId:
 *                      type: string
 *                      description: the id of the recepient
 *              required:
 *                  - senderId
 *                  - recepientId
 *     responses:
 *       200:
 *         description: Success !
 *     security:
 *       - bearerAuth: [] 
 */
router.post("/messages", validateToken, messageController.getAllMessage);

