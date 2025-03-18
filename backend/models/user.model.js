import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cin: {
      type: String,
      required: true,
      unique: true,
    },
    tel: {
      type: String,
      required: true,
    },
    img: { type: String },
    role: {
      type: String,
      enum: ["instructor", "user", "admin", "learner"],
      default: "user",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    loginAttempts: Number,
    lockUntil: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
