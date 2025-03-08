import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Instructions.css";

const Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="instructions-container">
      <div className="instructions-card">
        <h2>📌 Exam Instructions</h2>
        <p>Please read the following instructions carefully before starting your test.</p>

        <ul className="instructions-list">
          <li>⏳ The test is timed. Make sure you complete all questions before time runs out.</li>
          <li>🚫 Do not refresh or leave the page, as this may result in automatic submission.</li>
          <li>✅ Answer all questions carefully; you can navigate back and forth.</li>
          <li>📖 Read each question thoroughly before selecting an answer.</li>
          <li>🎯 Click the  <span className="font-bold px-2"> Start </span> button when you are ready.</li>
        </ul>

        <button className="start-btn" onClick={() => navigate("/questions")}>Start Test</button>
      </div>
    </div>
  );
};

export default Instructions;
