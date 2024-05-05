const express = require("express");
const cors = require("cors");
const router = express.Router();
const courseMiddleware = require("../middlewares/courseMiddleware");
const authUtil = require("../util/authUtil");
router.use(cors());

router.get("/", courseMiddleware.getAllCourses);
router.post("/create-course", authUtil.protect, courseMiddleware.createCourse);

module.exports = router;
