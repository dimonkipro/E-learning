import express from "express";
import {
  addCategory,
  addCourse,
  archiveCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/course.controller.js";
import { uploadImage } from "../utils/multerConfig.js";
import {
  deleteUser,
  editUserRole,
  getAllUsers,
  verifyUser,
} from "../controllers/user.controller.js";
import {
  getAllInscriptions,
  updateInscriptionStatus,
} from "../controllers/enrollment.controller.js";

const router = express.Router();
// ------------------CoursesRoute----------------------------

router.post("/category/new", addCategory);
router.post(
  "/course/new",
  uploadImage("courses_cover").single("image"),
  addCourse
);

router.put("/courses/:courseId/toggle-archive", archiveCourse);
router.put("/courses/:courseId", updateCourse);

router.delete("/courses/:courseId", deleteCourse);
// ------------------usersRoute----------------------------

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", editUserRole);
router.put("/users/:id/verify", verifyUser);

// ------------------EnrollmentRoutes----------------------------

router.get("/inscriptions", getAllInscriptions);
router.put("/inscriptions/:id/status", updateInscriptionStatus);

export default router;
