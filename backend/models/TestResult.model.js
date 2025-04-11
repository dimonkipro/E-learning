// TestResult.model.js
import mongoose from "mongoose";

const ResultDetailSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    userAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const TestResultSchema = new mongoose.Schema({
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  totalQuestions: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  results: [ResultDetailSchema],
  attempts: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

const TestResult = mongoose.model("TestResult", TestResultSchema);

export default TestResult;
