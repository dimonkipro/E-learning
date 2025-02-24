import mongoose from "mongoose";

const TestSchema = new mongoose.Schema(
  {
    module_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module", 
      required: true,
    },
    minimum_score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Test", TestSchema);
