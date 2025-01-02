import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SchedulePage from "./pages/SchedulePage";
import MonthPage from "./pages/MonthPage";
import WeeklyPage from "./pages/WeeklyPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/Schedule" element={<SchedulePage />} />
        <Route path="/Schedule/Monthly" element={<MonthPage />} />
        <Route path="/Schedule/Weekly" element={<WeeklyPage />} />
      </Routes>
    </Router>
  );
};

export default App;