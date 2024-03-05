import express from "express";
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateTokenHandler.js";

export const router = express.Router();

router.get("/users", validateToken, userController.getUsers);

router.post("/compareContacts", validateToken, userController.compareContacts);

router.put("/update", validateToken, userController.updateUserDetails);
