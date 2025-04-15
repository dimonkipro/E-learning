/* eslint-disable react/prop-types */
import { useState } from "react";
import { submitTest } from "../redux/auth/moduleSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestResults } from "../redux/auth/courseSlice";

const TestContainer = ({
  selectedTest,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  clearTest,
  courseId,
  passedTestsIdList,
}) => {
  const dispatch = useDispatch();

  const [testResults, setTestResults] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const { user } = useSelector((state) => state.auth);
  const isTestPassed =
    passedTestsIdList && passedTestsIdList.includes(selectedTest._id);
  console.log(selectedTest);
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

  // Return detailed results.
  const handleSubmitTest = () => {
    dispatch(
      submitTest({ testId: selectedTest._id, userAnswers: selectedAnswers })
    )
      .unwrap()
      .then((res) => {
        if (user?.role === "learner" && courseId) {
          setTimeout(() => {
            dispatch(fetchTestResults(courseId));
          }, 10000);
        }
        // The backend returns: { msg, score, passed, totalQuestions, correctCount, results, testResultId }
        setTestResults(res);
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error("Error submitting test:", error);
      });
  };
  // Handler for when a user selects an answer option.
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
        {isTestPassed && (
          <i className="bi bi-clipboard-check-fill h5"> Passé</i>
        )}
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

      {/* Test Result if Passed */}
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
                        disabled={
                          user?.role === "instructor" || user?.role === "admin"
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
                {(user?.role === "instructor" || user?.role === "admin") && (
                  <p className="text-center text-success fw-bold">
                    {`✓ ${selectedTest.questions[currentQuestionIndex].correct_answer}
                     ✓`}
                  </p>
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
                        selectedTest.questions.length ||
                      user?.role === "admin" ||
                      user?.role === "instructor"
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
        //  Test Result if not passed
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
            <div key={index} className="card mb-3">
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
                  {result.options.map((option, optIndex) => {
                    const isUserAnswer = option === result.userAnswer;
                    const isCorrectAnswer = option === result.correctAnswer;
                    const showCorrect =
                      testResults.attempts >= 5 ||
                      result.correctAnswer === result.userAnswer;

                    return (
                      <div
                        key={optIndex}
                        className={`form-check ${
                          showCorrect && isCorrectAnswer
                            ? "text-success fw-bold"
                            : ""
                        } ${
                          isUserAnswer && !result.isCorrect ? "text-danger" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          className="form-check-input"
                          checked={
                            isUserAnswer || (showCorrect && isCorrectAnswer)
                          }
                          disabled
                        />
                        <label className="form-check-label">
                          {option}
                          {showCorrect && isCorrectAnswer && " ✓"}
                          {isUserAnswer && !result.isCorrect && " ✗"}
                        </label>
                      </div>
                    );
                  })}
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
