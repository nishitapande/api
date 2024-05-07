const express = require("express");
const cors = require("cors");
const router = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");
const authUtil = require("../util/authUtil");

router.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://courses-api-production.up.railway.app",
    ],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
router.get("/", authUtil.protect, userMiddleware.getUser);
router.get("/:userId/courses", authUtil.protect, userMiddleware.getUserCourses);
router.post("/register", userMiddleware.createUser);
router.post("/login", userMiddleware.loginUser);
router.put(
  "/:userId/:courseId",
  authUtil.protect,
  userMiddleware.addCourseToUser
);

module.exports = router;
