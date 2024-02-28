import express from "express";
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateTokenHandler.js";

export const router = express.Router();

router.get("/users", validateToken, userController.getUsers);
router.get("/friendRequests", validateToken, userController.getFriendRequests);

router.post("/friend-request", validateToken, userController.postFriendRequest);
router.put("/update", validateToken, userController.updateUserDetails);
