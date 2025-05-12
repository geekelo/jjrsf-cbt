import  { useState, useEffect } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [score, setScore] = useState(0);
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

    setTimeLeft(examData.duration * 60);
    setQuestions(shuffleArray(examData.clacbt_questions || []));
  }, [navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (questions.length > 0 && questions[currentIndex]?.clacbt_answers) {
      setShuffledOptions(shuffleArray([...questions[currentIndex].clacbt_answers]));
    }
  }, [questions, currentIndex]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOptionSelect = (selectedOpt) => {
    if (selectedOption) return;
  
    setSelectedOption(selectedOpt);
    const currentQuestion = questions[currentIndex];
    const correctAnswerObj = currentQuestion.clacbt_answers.find((ans) => ans.correct);
    const correctAnswerIndex = shuffledOptions.findIndex((opt) => opt.id === correctAnswerObj.id);
  
    let newScore = score;
    if (selectedOpt.id === correctAnswerObj.id) {
      newScore += currentQuestion.mark;
      setScore(newScore);
      setFeedbackMessage(`✅ Correct! The correct answer is (${String.fromCharCode(65 + correctAnswerIndex)}): "${correctAnswerObj.answer_text}"`);
    } else {
      setFeedbackMessage(`❌ Wrong! The correct answer is (${String.fromCharCode(65 + correctAnswerIndex)}): "${correctAnswerObj.answer_text}"`);
    }
  
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setFeedbackMessage("");
      } else {
        handleFinish(newScore);
      }
    }, 2000);
  };
  const handleFinish = async (finalScore = score) => {
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
          <div className="question-card">
            <h2>Question {currentIndex + 1} of {questions.length}</h2>
            <p className="question-text">{questions[currentIndex]?.question}</p>
            <ul className="options-list">
              {shuffledOptions.map((opt, index) => (
                <li
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt)}
                  className={`option ${
                    selectedOption?.id === opt.id ? (opt.correct ? "correct" : "wrong") : ""
                  } ${selectedOption && opt.correct ? "highlight-correct" : ""}`}
                >
                  <strong>{String.fromCharCode(65 + index)}.</strong> {opt.answer_text}
                </li>
              ))}
            </ul>
            {feedbackMessage && <p className="answer-feedback">{feedbackMessage}</p>}
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
