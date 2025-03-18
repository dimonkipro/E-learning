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
import isLearner from "../middleware/isLearner.js";

import {
  getAllCategories,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
} from "../controllers/course.controller.js";
import { createInscription, getUserInscriptions } from "../controllers/enrollment.controller.js";
import isVerified from "../middleware/isVerified.js";

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
router.get("/courses/:courseId", getCourseById);
router.get("/courses/category/:categoryId", getCoursesByCategory);
router.get("/category/all", getAllCategories);

router.get(
  "/inscriptions/me",
  verifyToken,
  isVerified,
  isLearner,
  getUserInscriptions
);
// ------------------EnrollmentRoutes----------------------------

router.post(
  "/inscription/new/:courseId",
  verifyToken,
  isVerified,
  createInscription
);

export default router;
