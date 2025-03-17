import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Home.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Home = () => {
  const { exam_code } = useParams(); // Get exam code from URL
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exam_code) {
      if (!/^[a-zA-Z0-9]{6}$/.test(exam_code)) {
        toast.error(
          "Invalid exam code! It must be exactly 6 letters or digits.",
          { position: "top-right" }
        );
      }
    }
  }, [exam_code]);

  const validateAndCheckEmail = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email!", { position: "top-right" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+$/.test(email)) {
      toast.error("Invalid email format", { position: "top-right" });
      return;
    }

    if (!exam_code || !/^[a-zA-Z0-9]{6}$/.test(exam_code)) {
      toast.error("Invalid exam code!", { position: "top-right" });
      return;
    }
    setLoading(true);

    try {
      const apiUrl = `${API_BASE_URL}/clacbt_check_candidates/check?exam_code=${exam_code}&email=${email}`;
      const response = await axios.get(apiUrl);
      if (response.data.message === "Candidate authorized") {
        localStorage.setItem(
          "candidate",
          JSON.stringify({
            ...response.data.candidate,
            timestamp: new Date().getTime(),
          })
        );

        toast.success("Email verified! Redirecting...", {
          position: "top-right",
        });
        setTimeout(() => navigate("/instructions"), 1500);
      } else {
        toast.error(
          "Invalid credentials. Please check your email or exam code.",
          {
            position: "top-right",
          }
        );
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again later.",
        { position: "top-right" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <ToastContainer />
      <div className="home-card">
        <h2>Welcome to CBT Platform</h2>
        <p>Verify your email to access</p>
        <input
          type="email"
          className="email-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button
          className="proceed-btn"
          onClick={validateAndCheckEmail}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Proceed"}
        </button>
      </div>
    </div>
  );
};

export default Home;
