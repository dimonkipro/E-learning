import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    test_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String], 
      required: true,
    },
    correct_answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);
