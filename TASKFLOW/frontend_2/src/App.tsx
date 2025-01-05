import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import SchedulePage from "./pages/SchedulePage";
import MonthPage from "./pages/MonthPage";
import WeeklyPage from "./pages/WeeklyPage";
import TodayPage from "./pages/TodayPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectCreatePage from "./pages/ProjectCreatePage";
import ProjectPageEdit from "./pages/ProjectPageEdit";
import FindEmail from "./pages/FindEmail";
import ResetPassword from "./pages/ResetPassword";
import PersonalInfoPage from "./pages/PersonalInfoUpdate";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import TermsPage from "./pages/TermsPage";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/findemail" element={<FindEmail />} />
        <Route path="/login/resetpassword" element={<ResetPassword />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/schedule" element={
          <ProtectedRoute>
            <SchedulePage />
          </ProtectedRoute>
        } />
        <Route path="/schedule/monthly" element={
          <ProtectedRoute>
            <MonthPage />
          </ProtectedRoute>
        } />
        <Route path="/schedule/weekly" element={
          <ProtectedRoute>
            <WeeklyPage />
          </ProtectedRoute>
        } />
        <Route path="/schedule/Today" element={
          <ProtectedRoute>
            <TodayPage />
          </ProtectedRoute>
        } />
        <Route path="/project" element={
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        } />
        <Route path="/project/create" element={
          <ProtectedRoute>
            <ProjectCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/project/edit/:projectId" element={
          <ProtectedRoute>
            <ProjectPageEdit />
          </ProtectedRoute>
        } />
        <Route path="/personalinfo/update" element={
          <ProtectedRoute>
            <PersonalInfoPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;