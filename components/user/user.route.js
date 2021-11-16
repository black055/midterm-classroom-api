import express from 'express';
const router = express.Router();

import userController from "./user.controller.js";

router.get("/", userController.getUser);

router.get("/id/:id")
router.get("/email/:email")

export default router;