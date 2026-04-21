import  { useState, useEffect, useMemo, useRef } from "react";
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
  const [feedbackByQuestionId, setFeedbackByQuestionId] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

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
    setFeedbackByQuestionId({});
    setScore(0);
  }, [navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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
    if (selectedOptionByQuestionId[question.id]) return;

    const options = shuffledOptionsByQuestionId[question.id] || [];
    const correctAnswerObj = (question.clacbt_answers || []).find((ans) => ans.correct);
    const correctAnswerIndex =
      correctAnswerObj ? options.findIndex((opt) => opt.id === correctAnswerObj.id) : -1;

    setSelectedOptionByQuestionId((prev) => ({ ...prev, [question.id]: selectedOpt }));

    if (correctAnswerObj && selectedOpt.id === correctAnswerObj.id) {
      setScore((prev) => prev + (question.mark || 0));
      setFeedbackByQuestionId((prev) => ({
        ...prev,
        [question.id]: `✅ Correct! The correct answer is (${String.fromCharCode(65 + correctAnswerIndex)}): "${correctAnswerObj.answer_text}"`,
      }));
    } else if (correctAnswerObj) {
      setFeedbackByQuestionId((prev) => ({
        ...prev,
        [question.id]: `❌ Wrong! The correct answer is (${String.fromCharCode(65 + correctAnswerIndex)}): "${correctAnswerObj.answer_text}"`,
      }));
    } else {
      setFeedbackByQuestionId((prev) => ({
        ...prev,
        [question.id]: `Saved your answer.`,
      }));
    }
  };

  const handleFinish = async (finalScore = scoreRef.current) => {
    if (questions.length > 0) {
      const totalMarks = questions.reduce((acc, q) => acc + q.mark, 0);
      const examData = JSON.parse(localStorage.getItem("exam"));
      const candidate = JSON.parse(localStorage.getItem("candidate"));
  
      if (!examData || !candidate) {
        console.error("Exam or candidate data not found in local storage.");
        return;
      }
  
      const apiUrl = `${API_BASE_URL}/clacbt_exams/${examData.id}/clacbt_candidates/${candidate.id}`;
  
      const payload = {
        clacbt_candidate: {
          email: candidate.email,
          score: finalScore,
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
  
      setModalMessage(`Test Completed! Your Score: ${finalScore} / ${totalMarks}`);
      setShowModal(true);
  
      // Navigate to confirmation page after a delay
      setTimeout(() => navigate("/confirmation"), 3000);
    }
  };
  

  
  return (
    <div className="question-container">
      <h1>{JSON.parse(localStorage.getItem("exam"))?.name || "Exam"}</h1>
      <div className="question-box">
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>

        {questions.length > 0 ? (
          <div className="questions-list">
            <div className="questions-meta">
              <div className="questions-progress">
                Answered: {answeredCount} / {questions.length} (Score: {score})
              </div>
              <button
                className="finish-button"
                onClick={() => handleFinish()}
                disabled={showModal}
              >
                Finish / Submit
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
                      return (
                        <li
                          key={opt.id}
                          onClick={() => handleOptionSelect(q, opt)}
                          className={`option ${
                            isSelected ? (isCorrect ? "correct" : "wrong") : ""
                          } ${selected && correctAnswerObj && isCorrect ? "highlight-correct" : ""}`}
                        >
                          <strong>{String.fromCharCode(65 + index)}.</strong> {opt.answer_text}
                        </li>
                      );
                    })}
                  </ul>
                  {feedbackByQuestionId[q.id] && (
                    <p className="answer-feedback">{feedbackByQuestionId[q.id]}</p>
                  )}
                </div>
              );
            })}
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
