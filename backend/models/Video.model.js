import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    module_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module", // Reference to the Module model
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    video_url: {
      type: String,
      required: true,
      unique: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
