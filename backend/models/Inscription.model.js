import mongoose from "mongoose";

const inscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  formData: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cin: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    motivation: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  
},
{ timestamps: true },
);

export const Inscription = mongoose.model("Inscription", inscriptionSchema);
