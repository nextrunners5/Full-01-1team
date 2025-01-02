import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SchedulePage from "./pages/SchedulePage";
import MonthPage from "./pages/MonthPage";
import WeeklyPage from "./pages/WeeklyPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectPageCreate from "./pages/ProjectPageCreate";
import ProjectPageEdit from "./pages/ProjectPageEdit";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/schedule/monthly" element={<MonthPage />} />
        <Route path="/schedule/weekly" element={<WeeklyPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/project/create" element={<ProjectPageCreate />} />
        <Route path="/project/edit/:projectId" element={<ProjectPageEdit />} />
      </Routes>
    </Router>
  );
};

export default App;