import { Category } from "../models/Category.model.js";
import { Course } from "../models/Course.model.js";
import Module from "../models/Module.model.js";
import Test from "../models/Test.model.js";
import Video from "../models/Video.model.js";
import Progress from "../models/Progress.js";
import Question from "../models/Question.model.js";
import TestResult from "../models/TestResult.model.js";
import { Inscription } from "../models/Inscription.model.js";
import Certificate from "../models/Certificate.model.js";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import { generateCertificate } from "../utils/certificateTemplate.js";
import { generateCertificate2 } from "../utils/certificateTemplateV2.js";
// ------------------Category----------------------------

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });
    res.send(categories);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(400).json({ msg: error.message });
    }
  }
};

// ------------------Course----------------------------

export const addCourse = async (req, res) => {
  try {
    const {
      title,
      level,
      category,
      description,
      instructor,
      price,
      createdBy,
      longDescription,
      goals,
    } = req.body;

    const existingTitleCourse = await Course.findOne({ title });
    if (existingTitleCourse) {
      return res.status(409).json({
        success: false,
        message: "Title already exists. Please use a unique title.",
      });
    }
    // If an image is provided, check for uniqueness
    if (req.file) {
      const existingCourse = await Course.findOne({ image: req.file.path });
      if (existingCourse) {
        return res.status(409).json({
          success: false,
          message: "Image already exists, please use a unique image.",
        });
      }
    }

    const newCourse = new Course({
      title,
      level,
      category,
      description,
      instructor,
      price,
      createdBy,
      longDescription,
      goals,
      image: req.file ? req.file.path : undefined,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error in addCourse:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .populate("category", "name")
      .populate("instructor", "name");
    res.send(courses);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(400).json({ msg: error.message });
    }
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("category", "name")
      .populate("instructor", "name");
    if (!course || course.archived) {
      return res.status(404).send({ msg: "Course not found or archived" });
    }
    res.send({ course });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(400).json({ msg: error.message });
    }
  }
};

export const getCoursesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const courses = await Course.find({ category: categoryId })
      .populate("category", "name")
      .populate("instructor", "name")
      .sort({ title: 1 });

    res.send(courses);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(400).json({ msg: error.message });
    }
  }
};

export const archiveCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Toggle the archived status
    course.archived = !course.archived;
    await course.save();

    const statusText = course.archived ? "archived" : "unarchived";

    res.json({ msg: `Course has been ${statusText} successfully.`, course });
  } catch (error) {
    console.error("Error toggling archive status:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Formation non trouvée" });
    }

    // Find all modules associated with the course.
    const modules = await Module.find({ course_id: courseId });

    // Loop through each module.
    for (const module of modules) {
      // Delete all videos related to the module.
      const videos = await Video.find({ module_id: module._id });
      const __dirname = path.resolve();
      for (const video of videos) {
        const filePath = path.join(__dirname, video.video_url);
        try {
          // Delete the video file.
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.error("Failed to delete video file:", err);
          // Optionally continue even if file deletion fails.
        }
        // Remove the video document.
        await Video.findByIdAndDelete(video._id);
        // Delete all progress records associated with this video.
        await Progress.deleteMany({ video: video._id });
      }

      // Delete the test associated with the module.
      const test = await Test.findOneAndDelete({ module_id: module._id });
      if (test) {
        // Delete all questions linked to the test.
        await Question.deleteMany({ test_id: test._id });
        // Delete all test results associated with this test.
        await TestResult.deleteMany({ test: test._id });
      }

      // Delete the module itself.
      await Module.findByIdAndDelete(module._id);
    }

    // Delete all inscriptions associated with the course.
    await Inscription.deleteMany({ courseId });

    // Finally, delete the course.
    await Course.findByIdAndDelete(courseId);

    res.json({ msg: "Formation supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting course", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const downloadCertificate = (req, res) => {
  const { learnerName, courseTitle, completionDate, instructorName } = req.body;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Set the response headers for PDF download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");

  // Generate the certificate and pipe it to the response
  generateCertificate2(
    {
      learnerName,
      courseTitle,
      completionDate,
      instructorName,
      logoPath: path.join(__dirname, "../uploads/Logo.png"),
    },
    res
  );
};

export const getOrCreateCertificate = async (req, res) => {
  try {
    const { learnerId, courseId, instructorId } = req.body;

    // Check if the certificate already exists
    let certificate = await Certificate.findOne({ learnerId, courseId });

    if (!certificate) {
      // Create a new certificate if it doesn't exist
      certificate = new Certificate({ learnerId, courseId, instructorId });
      await certificate.save();
    }

    res.status(200).json({ success: true, certificate });
  } catch (error) {
    console.error("Error generating or retrieving certificate:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
