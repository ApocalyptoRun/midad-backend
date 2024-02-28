import express from 'express';
import authController  from '../controllers/authController.js';

export const router = express.Router();


router.post('/sendOTP', authController.sendOTP);

router.post('/signup/verifyOTP', authController.verifyOTP);

router.post('/signin', authController.signin);





