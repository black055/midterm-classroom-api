import express from "express";
import userController from "./user.controller.js";

const router = express.Router();

router.get("/", userController.getUser);

router.put("/", userController.updateProfile);

router.put("/password", userController.updatePassword);
// router.get("/email/:email");

export default router;
