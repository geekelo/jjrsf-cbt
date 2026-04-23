import  { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QuestionPage.css";

const shuffleArray = (array) => {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [shuffledOptionsByQuestionId, setShuffledOptionsByQuestionId] = useState({});
  const [selectedOptionByQuestionId, setSelectedOptionByQuestionId] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const scoreRef = useRef(0); // holds latest computed final score after submit
  const navigate = useNavigate();

  useEffect(() => {
    const examData = JSON.parse(localStorage.getItem("exam"));
    if (!examData) {
      navigate("/");
      return;
    }
    const currentTimeISO = new Date().toISOString().replace("T", " ").split(".")[0];
const examStartTime = new Date(examData.start_time).toISOString().replace("T", " ").split(".")[0];
const examEndTime = new Date(examData.end_time).toISOString().replace("T", " ").split(".")[0];

console.log("Current Time:", currentTimeISO);
console.log("Exam Start Time:", examStartTime);
console.log("Exam End Time:", examEndTime);

if (currentTimeISO < examStartTime) {
  setModalMessage(`The exam is scheduled for ${new Date(examData.start_time)}`);
  setShowModal(true);
  return;
}

if (currentTimeISO > examEndTime) {
  setModalMessage("This exam has expired. Please contact support.");
  setShowModal(true);
  return;
}

    const shuffledQuestions = shuffleArray(examData.clacbt_questions || []);
    setTimeLeft(examData.duration * 60);
    setQuestions(shuffledQuestions);
    setShuffledOptionsByQuestionId(
      shuffledQuestions.reduce((acc, q) => {
        acc[q.id] = shuffleArray([...(q.clacbt_answers || [])]);
        return acc;
      }, {})
    );
    setSelectedOptionByQuestionId({});
    setSubmitted(false);
    setSubmitting(false);
    setFinalScore(null);
    scoreRef.current = 0;
  }, [navigate]);

  const totalMarks = useMemo(() => {
    return questions.reduce((acc, q) => acc + (q.mark || 0), 0);
  }, [questions]);

  const computeScore = useCallback(() => {
    return questions.reduce((acc, q) => {
      const selected = selectedOptionByQuestionId[q.id];
      if (!selected) return acc;
      const correct = (q.clacbt_answers || []).find((a) => a.correct);
      if (correct && selected.id === correct.id) return acc + (q.mark || 0);
      return acc;
    }, 0);
  }, [questions, selectedOptionByQuestionId]);

  const handleFinish = useCallback(
    async () => {
      if (submitted || submitting) return;
      if (questions.length > 0) {
        setSubmitting(true);
        const computed = computeScore();
        scoreRef.current = computed;
        setFinalScore(computed);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });

        const examData = JSON.parse(localStorage.getItem("exam"));
        const candidate = JSON.parse(localStorage.getItem("candidate"));
    
        if (!examData || !candidate) {
          console.error("Exam or candidate data not found in local storage.");
          setSubmitting(false);
          return;
        }
    
        const apiUrl = `${API_BASE_URL}/clacbt_exams/${examData.id}/clacbt_candidates/${candidate.id}`;
    
        const payload = {
          clacbt_candidate: {
            email: candidate.email,
            score: computed,
          },
        };
    
        try {
          const response = await fetch(apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    
          if (!response.ok) {
            throw new Error(`Failed to submit score: ${response.statusText}`);
          }
    
          console.log("Score submitted successfully:", await response.json());
        } catch (error) {
          console.error("Error updating score:", error);
        }

        setSubmitting(false);
      }
    },
    [computeScore, questions.length, submitted, submitting]
  );

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [handleFinish, submitted, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const answeredCount = useMemo(() => {
    return Object.keys(selectedOptionByQuestionId).length;
  }, [selectedOptionByQuestionId]);

  const handleOptionSelect = (question, selectedOpt) => {
    if (!question?.id) return;
    if (submitted) return;

    setSelectedOptionByQuestionId((prev) => ({ ...prev, [question.id]: selectedOpt }));
  };
  

  
  return (
    <div className="question-container">
      <h1>{JSON.parse(localStorage.getItem("exam"))?.name || "Exam"}</h1>
      <div className="question-box">
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>

        {questions.length > 0 ? (
          <div className="questions-list">
            {submitted && (
              <div className="results-summary">
                <div className="results-title">Results</div>
                <div className="results-score">
                  Score: {finalScore ?? scoreRef.current} / {totalMarks}
                </div>
                <div className="results-subtext">
                  You answered {answeredCount} / {questions.length}.
                </div>
              </div>
            )}

            <div className="questions-meta">
              <div className="questions-progress">
                Answered: {answeredCount} / {questions.length}
                {!submitted && (
                  <div className="questions-note">
                    Note: Please ensure you have answered all questions and crosschecked your
                    answers before submitting.
                  </div>
                )}
              </div>
              <button
                className="finish-button"
                onClick={() => handleFinish()}
                disabled={submitted || submitting}
              >
                {submitting ? "Submitting..." : submitted ? "Submitted" : "Finish / Submit"}
              </button>
            </div>

            {questions.map((q, qIndex) => {
              const selected = selectedOptionByQuestionId[q.id];
              const options = shuffledOptionsByQuestionId[q.id] || [];
              const correctAnswerObj = (q.clacbt_answers || []).find((ans) => ans.correct);

              return (
                <div key={q.id || qIndex} className="question-card">
                  <h2>Question {qIndex + 1} of {questions.length}</h2>
                  <p className="question-text">{q?.question}</p>
                  <ul className="options-list">
                    {options.map((opt, index) => {
                      const isSelected = selected?.id === opt.id;
                      const isCorrect = !!opt.correct;
                      const showCorrectness = submitted;
                      const userPickedWrong = showCorrectness && isSelected && !isCorrect;
                      const showCorrectHighlight = showCorrectness && isCorrect;
                      return (
                        <li
                          key={opt.id}
                          onClick={() => handleOptionSelect(q, opt)}
                          className={`option ${isSelected ? "selected" : ""} ${
                            userPickedWrong ? "wrong" : ""
                          } ${showCorrectHighlight ? "highlight-correct" : ""}`}
                        >
                          <strong>{String.fromCharCode(65 + index)}.</strong> {opt.answer_text}
                        </li>
                      );
                    })}
                  </ul>

                  {submitted && (
                    <div className="review-row">
                      <div className="review-item">
                        <span className="review-label">Your answer:</span>{" "}
                        <span className="review-value">
                          {selected?.answer_text || "No answer"}
                        </span>
                      </div>
                      <div className="review-item">
                        <span className="review-label">Correct answer:</span>{" "}
                        <span className="review-value">
                          {correctAnswerObj?.answer_text || "—"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="questions-meta questions-meta-bottom">
              <div className="questions-progress" />
              <button
                className="finish-button"
                onClick={() => handleFinish()}
                disabled={submitted || submitting}
              >
                {submitting ? "Submitting..." : submitted ? "Submitted" : "Finish / Submit"}
              </button>
            </div>
          </div>
        ) : (
          <p className="no-questions">No questions available for this exam.</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => navigate("/")}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
