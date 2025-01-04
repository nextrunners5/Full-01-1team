import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import SchedulePage from "./pages/SchedulePage";
import MonthPage from "./pages/MonthPage";
import WeeklyPage from "./pages/WeeklyPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectPageCreate from "./pages/ProjectPageCreate";
import ProjectPageEdit from "./pages/ProjectPageEdit";
import FindEmail from "./pages/FindEmail";
import ResetPassword from "./pages/ResetPassword";
import PersonalInfoPage from "./pages/PersonalInfoUpdate";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import TermsPage from "./pages/TermsPage";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/findemail" element={<FindEmail />} />
      <Route path="/login/resetpassword" element={<ResetPassword />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/schedule/monthly" element={<MonthPage />} />
      <Route path="/schedule/weekly" element={<WeeklyPage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/project/create" element={<ProjectPageCreate />} />
      <Route path="/project/edit/:projectId" element={<ProjectPageEdit />} />
      <Route path="/personalinfo/update" element={<PersonalInfoPage />} />
    </Routes>
  </Router>
);

export default App;