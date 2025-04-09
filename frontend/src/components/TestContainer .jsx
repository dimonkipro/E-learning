/* eslint-disable react/prop-types */
import { useState } from "react";

const TestContainer = ({
  selectedTest,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  clearTest,
}) => {
  const [testResults, setTestResults] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedTest.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Add submission handler
  const handleSubmitTest = () => {
    let correctCount = 0;
    const results = selectedTest.questions.map((question) => {
      const isCorrect =
        selectedAnswers[question._id] === question.correct_answer;
      if (isCorrect) correctCount++;
      return {
        ...question,
        userAnswer: selectedAnswers[question._id],
        isCorrect,
      };
    });

    const score = Math.round(
      (correctCount / selectedTest.questions.length) * 100
    );
    const passed = score >= selectedTest.minimum_score;

    setTestResults({
      score,
      passed,
      totalQuestions: selectedTest.questions.length,
      correctCount,
      results,
    });
    setIsSubmitted(true);
  };

  // Answer selection handler
  const handleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  return (
    <div className="custom-card rounded-4 shadow px-5 py-3 my-5">
      <div className="d-flex justify-content-between gap-2 flex-wrap align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={clearTest}>
          <i className="bi bi-caret-left-fill">Retour</i>
        </button>
        <h5 className="text-decoration-underline">
          Test: {selectedTest.module_id?.title}
        </h5>
        <div className="d-flex flex-wrap justify-content-center gap-3 align-items-center">
          <div className="d-flex flex-column badge bg-success rounded-pill p-2">
            <span className="fw-normal">Minimum</span>
            <span className="fw-normal">score</span>
            <span>{selectedTest.minimum_score}</span>
          </div>
          <p className="text-center fw-bold">
            {currentQuestionIndex + 1}/{selectedTest.questions.length}
          </p>
        </div>
      </div>

      {!isSubmitted ? (
        <>
          {selectedTest.questions[currentQuestionIndex] && (
            <div className="test-question">
              <h4 className="mb-4 text-center fw-normal">
                - {selectedTest.questions[currentQuestionIndex].question} -
              </h4>
              <div className="options-container col-8 mx-auto">
                {selectedTest.questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div
                      key={index}
                      className="form-check mb-3 border-bottom border-secondary rounded-3 p-1 animate"
                    >
                      <input
                        type="radio"
                        className="form-check-input"
                        name={`question-${selectedTest.questions[currentQuestionIndex]._id}`}
                        id={`option-${index}-${selectedTest.questions[currentQuestionIndex]._id}`}
                        onChange={() =>
                          handleAnswerSelect(
                            selectedTest.questions[currentQuestionIndex]._id,
                            option
                          )
                        }
                        checked={
                          selectedAnswers[
                            selectedTest.questions[currentQuestionIndex]._id
                          ] === option
                        }
                      />
                      <label
                        className="form-check-label d-flex ms-2"
                        htmlFor={`option-${index}-${selectedTest.questions[currentQuestionIndex]._id}`}
                        style={{ cursor: "pointer" }}
                      >
                        {option}
                      </label>
                    </div>
                  )
                )}
              </div>
              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <i className="bi bi-chevron-double-left"></i>
                </button>
                {currentQuestionIndex === selectedTest.questions.length - 1 ? (
                  <button
                    className="btn btn-outline-success"
                    onClick={handleSubmitTest}
                    disabled={
                      Object.keys(selectedAnswers).length <
                      selectedTest.questions.length
                    }
                  >
                    Vérifier la résultat
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleNextQuestion}
                  >
                    <i className="bi bi-chevron-double-right"></i>
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="test-results">
          <h4 className="mb-4">Test Results</h4>
          <div
            className={`alert ${
              testResults.passed ? "alert-success" : "alert-danger"
            }`}
          >
            <h5>
              Score: {testResults.score}% ({testResults.correctCount}/
              {testResults.totalQuestions})
              {testResults.passed ? " - Passé! 🎉" : " - Échec 😞"}
            </h5>
            <p>Score minimum requis: {selectedTest.minimum_score}%</p>
          </div>
          {testResults.results.map((result, index) => (
            <div key={result._id} className="card mb-3">
              <div
                className={`card-header ${
                  result.isCorrect
                    ? "bg-success text-white"
                    : "bg-danger text-white"
                }`}
              >
                Question {index + 1}
              </div>
              <div className="card-body">
                <h5>{result.question}</h5>
                <div className="ms-3">
                  {result.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`form-check ${
                        option === result.correct_answer
                          ? "text-success fw-bold"
                          : ""
                      } ${
                        option === result.userAnswer && !result.isCorrect
                          ? "text-danger"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={
                          option === result.userAnswer ||
                          option === result.correct_answer
                        }
                        disabled
                      />
                      <label className="form-check-label">
                        {option}
                        {option === result.correct_answer && " ✓"}
                        {option === result.userAnswer &&
                          !result.isCorrect &&
                          " ✗"}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestContainer;
