import express from 'express';
import courseController from "./course.controller.js";

const router = express.Router();

router.get("/", courseController.getCourses);

router.get("/:id", courseController.getOneCourse);

router.post("/", courseController.createCourse);

router.post("/join", courseController.userJoinCourse);

router.post("/invite/teacher", courseController.sendTeacherEmail);

router.post("/invite/student", courseController.sendStudentEmail);

export default router;
