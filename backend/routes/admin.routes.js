import express from "express";
import { addCategory, addCourse } from "../controllers/course.controller.js";
import { uploadImage } from "../utils/multerConfig.js";
import {
  deleteUser,
  editUserRole,
  getAllUsers,
} from "../controllers/user.controller.js";

const router = express.Router();
// ------------------CoursesRoute----------------------------

router.post("/category/new", addCategory);
router.post("/course/new", uploadImage("courses_cover").single("image"), addCourse);

// ------------------usersRoute----------------------------

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", editUserRole);
export default router;
