import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ConfirmationPage.css"; 

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmation-container">
      <h1>🎉 Congratulations! 🎉</h1>
      <p>Thank you for completing the exam.</p>
      <p>Check your email for further details.</p>
     
    </div>
  );
};

export default ConfirmationPage;
