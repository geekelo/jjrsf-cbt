import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Home.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Home = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateAndCheckEmail = async () => {
    if (!email) {
      toast.error("Please enter your email!", { position: "top-right" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email format", { position: "top-right" });
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `${API_BASE_URL}/clacbt_check_candidates/check?exam_code=123456&email=${email}`;
      console.log("API URL:", apiUrl);

      const response = await axios.get(apiUrl);
      console.log("API Response:", response.data);

      if (response.data.message === "Candidate authorized") {
        const candidateData = response.data.candidate;

        localStorage.removeItem("candidate");

        const candidateWithExpiry = {
          ...candidateData,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem("candidate", JSON.stringify(candidateWithExpiry));

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

  const removeExpiredCandidate = () => {
    const storedCandidate = localStorage.getItem("candidate");
    if (storedCandidate) {
      const { timestamp } = JSON.parse(storedCandidate);
      const oneHour = 60 * 60 * 1000;
      if (new Date().getTime() - timestamp > oneHour) {
        localStorage.removeItem("candidate");
        console.log("Candidate data expired and removed.");
      }
    }
  };

  React.useEffect(() => {
    removeExpiredCandidate();
  }, []);

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
