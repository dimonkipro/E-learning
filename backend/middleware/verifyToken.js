import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; //send the user id to checkAuth() auth.controller
    next();
  } catch (error) {
    console.log("Error in verifyToken ", error);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
