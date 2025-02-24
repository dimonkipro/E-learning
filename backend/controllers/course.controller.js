import { Category } from "../models/Category.model.js";
import { Course } from "../models/Course.model.js";

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
      .sort({ title: 1 })
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
    if (!course) {
      return res.status(404).send({ msg: "Course not found" });
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
