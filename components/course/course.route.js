const express = require("express");
const courseController = require("./course.controller");

const router = express.Router();

router.get("/", courseController.getCourses);

router.get("/:id", courseController.getOneCourse);

router.post("/", courseController.createCourse);

module.exports = router;
