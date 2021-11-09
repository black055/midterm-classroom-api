import express from 'express';
import courseController from "./course.controller.js";

const router = express.Router();

router.get("/", courseController.getCourses);

router.get("/:id", courseController.getOneCourse);

router.post("/", courseController.createCourse);

export default router;
