import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ name: 1 });
    res.send(users);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(400).json({ msg: error.message });
    }
  }
};
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).select(
      "-password"
    );
    if (!deletedUser) {
      return res.status(404).send({ msg: "User not found" });
    }
    res.send({ msg: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(400).json({ msg: error.message });
    }
  }
};
export const editUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["user", "admin", "instructor"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
