import mongoose from "mongoose";
import Module from "../models/Module.model.js";
import Video from "../models/Video.model.js";
import Test from "../models/Test.model.js";
import Question from "../models/Question.model.js";
import { Course } from "../models/Course.model.js";
import fs from "fs";
import path from "path";

// ------------------Modules----------------------------

export const addModule = async (req, res) => {
  try {
    const { title, order } = req.body;
    const courseId = req.params.id;

    // Validate input
    if (!title || typeof order !== "number") {
      return res.status(400).json({ msg: "Title and order are required." });
    }

    // Validate the course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ msg: "Invalid course ID." });
    }

    const newModule = new Module({
      course_id: courseId,
      title,
      order,
    });

    await newModule.save();

    res.status(201).json(newModule);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ msg: error.message });
    }
  }
};

export const updateModuleContent = async (req, res) => {
  try {
    const moduleId = req.params.moduleId;

    // Find the module by its ID
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ msg: "Module not found" });
    }

    const allowedModuleFields = ["title", "order"];
    allowedModuleFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        module[field] = req.body[field];
      }
    });

    await module.save();

    // Update test if provided.
    if (req.body.test) {
      let test = await Test.findOne({ module_id: module._id });
      if (!test) {
        // Create a new test if none exists.
        test = new Test({ module_id: module._id, ...req.body.test });
      } else {
        // Update allowed test fields.
        const allowedTestFields = ["minimum_score", "module_id"];
        allowedTestFields.forEach((field) => {
          if (req.body.test[field] !== undefined) {
            test[field] = req.body.test[field];
          }
        });
      }
      await test.save();

      // Update questions if provided (replace the existing questions for simplicity)
      if (req.body.test.questions) {
        await Question.deleteMany({ test_id: test._id });
        const questionsToInsert = req.body.test.questions.map((q) => ({
          test_id: test._id,
          ...q,
        }));
        await Question.insertMany(questionsToInsert);
      }
    }
    const updatedModule = await Module.findById(moduleId);
    const videos = await Video.find({ module_id: updatedModule._id }).sort({
      order: 1,
    });
    const updatedTest = await Test.findOne({ module_id: updatedModule._id });
    let questions = [];

    if (updatedTest) {
      questions = await Question.find({ test_id: updatedTest._id });
    }

    res.json({
      msg: "Module content updated successfully",
      module: {
        ...updatedModule.toObject(),
        videos, // Include the videos
        test: updatedTest ? { ...updatedTest.toObject(), questions } : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ------------------Videos----------------------------

export const addVideo = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const { title, order, duration } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: "No video file uploaded." });
    }

    const videoUrl = req.file.path;
    const nDuration = duration * 60;

    if (!title || !order || !videoUrl) {
      return res
        .status(400)
        .json({ msg: "Title, order, and video file are required." });
    }

    const existingTitleVideo = await Video.findOne({ title });
    if (existingTitleVideo) {
      return res.status(409).json({
        success: false,
        message: "Title already exists. Please use a unique title.",
      });
    }

    if (req.file) {
      const existingVideo = await Video.findOne({ video_url: req.file.path });
      if (existingVideo) {
        return res.status(409).json({
          success: false,
          message: "Video already exists, please use a unique video.",
        });
      }
    }
    // Create new video
    const newVideo = new Video({
      module_id: moduleId,
      title,
      video_url: req.file ? req.file.path : undefined,
      duration: nDuration,
      order,
    });

    await newVideo.save();

    res.status(201).json(newVideo);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ msg: error.message });
    }
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    // Find the video by ID
    const video = await Video.findById(videoId);
    const __dirname = path.resolve();
    if (!video) {
      return res.status(404).json({ msg: "Video not found" });
    }

    const filePath = path.join(__dirname, video.video_url);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Failed to delete video file" });
      }

      Video.findByIdAndDelete(videoId)
        .then(() => {
          res.json({ msg: "Video deleted successfully" });
        })
        .catch((err) => {
          console.error(err);
          res
            .status(500)
            .json({ msg: "Failed to delete video entry from database" });
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ------------------Tests----------------------------

export const addTest = async (req, res) => {
  try {
    const { minimum_score, questions } = req.body;
    const { moduleId } = req.params;

    // Create the test
    const test = await Test.create({ module_id: moduleId, minimum_score });

    // Create all questions and link them to the test
    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        test_id: test._id,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
      }))
    );

    res.status(201).json({
      msg: "Test created successfully",
      test,
      questions: createdQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating test" });
  }
};

export const getAllCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the course by ID
    const course = await Course.findById(courseId)
      .populate("category", "name")
      .populate("instructor", "name");

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Find all modules linked to the course
    const modules = await Module.find({ course_id: courseId }).sort({
      order: 1,
    });

    // Fetch tests, questions, and videos for each module
    const modulesWithTestsAndVideos = await Promise.all(
      modules.map(async (module) => {
        const video = await Video.find({ module_id: module._id }).sort({
          order: 1,
        });
        const test = await Test.findOne({ module_id: module._id }).populate(
          "module_id",
          "title"
        );;
        let questions = [];

        if (test) {
          questions = await Question.find({ test_id: test._id });
        }

        return {
          ...module.toObject(),
          videos: video,
          test: test ? { ...test.toObject(), questions } : null,
        };
      })
    );

    res.json({ course, modules: modulesWithTestsAndVideos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
