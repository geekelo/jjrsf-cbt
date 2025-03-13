import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Instructions.css";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Instructions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);const startTest = async () => {
    const candidateData = JSON.parse(localStorage.getItem("candidate"));
    console.log(candidateData)
  
    if (!candidateData || !candidateData.exam_code) {
      toast.error("Invalid candidate data. Please login again.", { position: "top-right" });
      navigate("/");
      return;
    }
  
    setLoading(true);
  
    try {
      console.log("Fetching exam with exam code:", candidateData.exam_code);
  
      const response = await axios.get(
        `${API_BASE_URL}/clacbt_exams/display_exam?exam_code=${candidateData.exam_code}`
      );
  
      console.log("Full API Response:", response);
      const examData = response.data;
      console.log("Extracted Exam Data:", examData);
  
      if (examData?.id) {
        const examWithExpiry = {
          ...examData,
          expiry: Date.now() + 60 * 60 * 1000, 
        };
  
        localStorage.setItem("exam", JSON.stringify(examWithExpiry));
  
        console.log("Exam saved in localStorage:", localStorage.getItem("exam"));
        
        toast.success("Exam loaded! Redirecting...", { position: "top-right" });
  
        setTimeout(() => {
          console.log("Navigating to /questions...");
          navigate("/questions");
        }, 500);
      } else {
        toast.error("Exam not found. Please try again.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
      toast.error(error.response?.data?.message || "Something went wrong.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="instructions-container">
      <div className="instructions-card">
        <h2>📌 Exam Instructions</h2>
        <p>Please read the following instructions carefully before starting your test.</p>

        <ul className="instructions-list">
          <li>⏳ The test is timed. Complete all questions before time runs out.</li>
          <li>🚫 Do not refresh or leave the page, as this may result in automatic submission.</li>
          <li>✅ Answer all questions carefully; you can navigate back and forth.</li>
          <li>📖 Read each question thoroughly before selecting an answer.</li>
          <li>🎯 Click the <span className="font-bold px-2">Start</span> button when you are ready.</li>
        </ul>

        <button className="start-btn" onClick={startTest} disabled={loading}>
          {loading ? "Loading..." : "Start Test"}
        </button>
      </div>
    </div>
  );
};

export default Instructions;
