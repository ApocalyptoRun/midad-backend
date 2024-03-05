import express from 'express';
import messageController from '../controllers/messageController.js';
import validateToken from '../middleware/validateTokenHandler.js';

export const router = express.Router();

router.post("/addMessage", validateToken, messageController.addMessage);
router.post("/messages", validateToken, messageController.getAllMessage);