import express from "express";
import {
  login,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getAllCategories,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
} from "../controllers/course.controller.js";

const router = express.Router();

// ------------------AuthRoutes----------------------------

router.get("/check-auth", verifyToken, checkAuth);

router.post("/user/signup", signup);
router.post("/user/login", login);
router.post("/user/verify-email", verifyEmail);
router.post("/user/forgot-password", forgotPassword);
router.post("/user/reset-password/:token", resetPassword);

// ------------------CourseRoutes----------------------------

router.get("/course/all", getAllCourses);
router.get("/course/:courseId", getCourseById);
router.get("/courses/category/:categoryId", getCoursesByCategory);
router.get("/category/all", getAllCategories);

export default router;
