import { Inscription } from "../models/Inscription.model.js";

const isLearner = async (req, res, next) => {
  try {
    const inscriptions = await Inscription.find({ userId: req.userId });

    if (inscriptions.length > 0) {
      req.inscriptions = inscriptions; // Attach the user's inscriptions to the request
      return next();
    } else {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden: No active subscription found",
        });
    }
  } catch (error) {
    console.error("Error in isLearner middleware:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default isLearner;
