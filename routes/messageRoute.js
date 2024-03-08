import express from 'express';
import messageController from '../controllers/messageController.js';
import validateToken from '../middleware/validateTokenHandler.js';
import upload from '../middleware/multer-config.js';

export const router = express.Router();

router.post("/addMessage", validateToken, upload.single("imageFile"), messageController.addMessage);

router.post("/messages", validateToken, messageController.getAllMessage);
