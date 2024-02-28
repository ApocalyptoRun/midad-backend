import express from 'express';
import validateToken from '../middleware/validateTokenHandler.js' 

export const router = express.Router();


router.get('/hello', validateToken, (req, res) => {
    res.json(req.user);
})

router.get('/hello', (req, res) => {
    res.json(req.user);
})

