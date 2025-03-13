import React from "react";
import "../styles/Help.css";

const HelpSection = () => {
    const guideSteps = [
        {
          title: "1. Receive Exam Link",
          description:
            "Candidates must receive the official exam link from the exam administrator. This link will take you to the test platform.",
        },
        {
          title: "2. Enter Your Email",
          description:
            "You must enter the same email used during registration. This ensures your exam details are correctly linked.",
        },
        {
          title: "3. Read Instructions Carefully",
          description:
            "Before starting, carefully read all instructions. Pay attention to the exam duration, question format, and submission rules.",
        },
        {
          title: "4. Exam Timing & Restrictions",
          description:
            "The exam can only be taken within the scheduled time. You cannot start before the exam start date or after the end date.",
        },
        {
          title: "5. Answer the Questions",
          description:
            "Carefully go through each question and provide the best possible answer. You may not be able to return to previous questions after submission.",
        },
        {
          title: "6. Immediate Result Display",
          description:
            "Once you complete the test, your result will be displayed immediately. Make sure to review your performance after submission.",
        },
      ];
      
  return (
    <div className="help-container">
      <h2 className="help-title">CBT Exam Guide</h2>
      <p className="help-description">
        Follow these steps to ensure a smooth test-taking experience.
      </p>
      <div className="help-cards">
        {guideSteps.map((step, index) => (
          <div key={index} className="help-card">
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpSection;
