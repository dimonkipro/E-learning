import { User } from "../models/user.model.js";

const isInstructor = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role === "instructor") {
      return next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Access denied" });
    }
  } catch (error) {
    res.status(401).send({ msg: "access denied" });
  }
};
export default isInstructor;
