import { Inscription } from "../models/Inscription.model.js";
import { sendSuccessEnrollment } from "../mails/emailService.js";
import { User } from "../models/user.model.js";

export const createInscription = async (req, res) => {
  try {
    if (!req.user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Utilisateur non verifié" });
    }

    if (req.body.email !== req.user.email) {
      return res
        .status(403)
        .json({ success: false, message: "Email mismatch" });
    }

    if (req.body.cin !== req.user.cin) {
      return res
        .status(403)
        .json({ success: false, message: "Carte identité non valide" });
    }

    const newInscription = await Inscription.create({
      userId: req.user._id,
      courseId: req.body.courseId,
      formData: req.body,
      status: "pending",
    });

    res.status(201).json({ success: true, data: newInscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllInscriptions = async (req, res) => {
  try {
    const { status, courseId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (courseId) filter.courseId = courseId;

    const inscriptions = await Inscription.find(filter)
      .populate("userId", "name email")
      .populate("courseId", ["title", "price"]);

    res.json({ success: true, data: inscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "approved", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status provided" });
    }

    const updatedInscription = await Inscription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("courseId", "title");

    if (!updatedInscription) {
      return res.status(404).json({ msg: "Inscription not found" });
    }

    const { userId, courseId } = updatedInscription;
    const { email, name } = userId;
    const { title: courseTitle } = courseId;

    // If status is approved, update user role to learner
    if (status === "approved") {
      await User.findByIdAndUpdate(userId._id, { role: "learner" });
    }

    await sendSuccessEnrollment(email, name, courseTitle, status);

    res.json({
      msg: "Inscription status updated successfully",
      data: updatedInscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getUserInscriptions = async (req, res) => {
  try {
    const inscriptions = await Inscription.find({
      userId: req.userId,
    }).populate({
      path: "courseId",
      populate: { path: "category", select: "name" }, // Populate category name
    });

    if (!inscriptions || inscriptions.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No inscriptions found" });
    }

    res.status(200).json({ success: true, inscriptions });
  } catch (error) {
    console.error("Error fetching inscriptions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
