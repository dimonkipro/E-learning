import express from "express";
import {
  addModule,
  addTest,
  addVideo,
  deleteModule,
  deleteTestById,
  deleteVideo,
  getAllCourseDetails,
  updateModuleContent,
} from "../controllers/module.controller.js";
import { uploadVideo } from "../utils/multerConfig.js";
const router = express.Router();

router.get("/course/:id/details", getAllCourseDetails);

// ------------------ModulesRoute----------------------------

router.post("/course/:id/module/new", addModule);
router.put("/module/:moduleId/update", updateModuleContent);
router.delete("/modules/:moduleId", deleteModule);

// ------------------VideosRoute----------------------------

router.post(
  "/module/:id/video/new",
  uploadVideo("videos").single("video"),
  addVideo
);
router.delete("/videos/:videoId", deleteVideo);

// ------------------TestsRoute----------------------------

router.post("/module/:moduleId/test/new", addTest);
router.delete("/tests/:testId", deleteTestById);

export default router;
