import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/Home";
import Instructions from "./components/Instructions";
import QuestionPage from "./components/Question";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/questions" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
};
export default App