import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Home.css";

const Home = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) {
      toast.error("Please enter your email!", { position: "top-right" });
      return;
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.success("Email validated! Redirecting...", { position: "top-right" });
      setTimeout(() => navigate("/instructions"), 1500);
    } else {
      toast.error("Invalid email format", { position: "top-right" });
    }
  };

  return (
    <div className="home-container">
      <ToastContainer /> {/* Ensures toasts are displayed */}
      <div className="home-card">
        <h2>Welcome to CBT Platform</h2>
        <p>Please enter your email to begin</p>
        <input
          type="email"
          className="email-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="proceed-btn" onClick={validateEmail}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Home;
