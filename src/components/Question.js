import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../assets/question";
import "../styles/QuestionPage.css";

const QuestionPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(2 * 60); // 2 minutes in seconds
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setAnswers((prev) => ({ ...prev, [questions[currentIndex]?.id]: option }));
  };

  const handleNext = () => {
    if (!selectedOption) {
      alert("Please select an answer!");
      return;
    }

    setAnsweredQuestions((prev) => new Set(prev).add(currentIndex));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(answers[questions[currentIndex + 1]?.id] || null);
    } else {
      handleFinish();
    }
  };
  const handleFinish = () => {
    let calculatedScore = 0;
  
    // Ensure we compare with the latest selected answers
    Object.keys(answers).forEach((questionId) => {
      const question = questions.find(q => q.id.toString() === questionId);
      if (question && answers[questionId] === question.answer) {
        calculatedScore += 1;
      }
    });
  
    setScore(calculatedScore);
    setShowModal(true);
  };
  
  return (
    <div className="question-container">
      {/* Timer Display */}
      <div className="timer">Time Left: {formatTime(timeLeft)}</div>

      <div className="question-card">
        <h2>Question {currentIndex + 1} of {questions.length}</h2>
        <p className="question-text">{questions[currentIndex].text}</p>

        <ul className="options-list">
          {questions[currentIndex].options.map((opt, index) => (
            <li 
              key={index} 
              className={`option ${selectedOption === opt ? "selected" : ""}`}
              onClick={() => handleOptionSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>

        <div className="nav-buttons">
          <button onClick={handleNext}>
            {currentIndex < questions.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      </div>

      {/* Score Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Test Completed!</h2>
            <p>Your Total Score: {score} / {questions.length}</p>
            <button onClick={() => navigate("/")}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
