import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

CertificateSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

const Certificate = mongoose.model("Certificate", CertificateSchema);
export default Certificate;
