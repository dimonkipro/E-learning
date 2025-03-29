import { useState } from "react";
import { addTest } from "../redux/auth/moduleSlice";
import { useDispatch } from "react-redux";
import { fetchCourseDetailsById } from "../redux/auth/courseSlice";

// eslint-disable-next-line react/prop-types
const AddTestForm = ({ showTestModal, setShowTestModal, selectedModuleId, courseId }) => {
  const dispatch = useDispatch();
  const [minimumScore, setMinimumScore] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);

  // Helper functions
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // Submit handler
  const handleAddTest = async (e) => {
    e.preventDefault();

    const testData = {
      minimum_score: Number(minimumScore),
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options.filter((opt) => opt.trim() !== ""),
        correct_answer: q.correctAnswer,
      })),
    };

    dispatch(
      addTest({
        testData,
        moduleId: selectedModuleId,
      })
    ).unwrap()
      .then(() => {
        dispatch(fetchCourseDetailsById(courseId));
        setShowTestModal(false);
        // Reset form
        setMinimumScore("");
        setQuestions([
          { question: "", options: ["", "", "", ""], correctAnswer: "" },
        ]);
      })
  };

  return (
    <div
      className={`modal ${showTestModal ? "show" : ""}`}
      style={{ display: showTestModal ? "block" : "none" }}
      aria-labelledby="testModal"
    >
      <form onSubmit={handleAddTest}>
        <div className="modal-dialog modal-lg modal-fullscreen-lg-down mx-auto">
          <div className="modal-content">
            <div className="modal-header p-4">
              <h6 className="modal-title">Ajouter un nouveau test</h6>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowTestModal(false)}
              ></button>
            </div>

            <div className="modal-body p-4">
              {/* Minimum Score */}
              <div className="mb-4">
                <label>Score Minimum (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={minimumScore}
                  onChange={(e) => setMinimumScore(e.target.value)}
                  min="0"
                  max="100"
                  required
                />
              </div>

              {/* Questions */}
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-3 p-3">
                  <div className="d-flex justify-content-between mb-2">
                    <h6>Question {qIndex + 1}</h6>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeQuestion(qIndex)}
                      disabled={questions.length === 1}
                    >
                      Supprimer
                    </button>
                  </div>

                  {/* Question Text */}
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "question", e.target.value)
                    }
                    required
                  />

                  {/* Options */}
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        required
                      />
                      {oIndex === q.options.length - 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => addOption(qIndex)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Correct Answer */}
                  <select
                    className="form-select"
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">Sélectionner la réponse correcte</option>
                    {q.options.map((option, oIndex) => (
                      <option key={oIndex} value={option}>
                        Option {oIndex + 1}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={addQuestion}
              >
                Ajouter une Question
              </button>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowTestModal(false)}
              >
                Fermer
              </button>
              <button type="submit" className="btn btn-warning">
                Créer Test
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTestForm;
