import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Home from "./components/Home";
import Instructions from "./components/Instructions";
import QuestionPage from "./components/Question";
import Layout from "./components/Layout";
import HelpSection from "./components/Help";
import ConfirmationPage from "./components/Confirmation";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/questions" element={<QuestionPage />} />
          <Route path="/help" element={<HelpSection />} />
          <Route path="/:exam_code" element={<Home />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
