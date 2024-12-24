import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SchedulePage from "./pages/SchedulePage"; // 일정 페이지 추가
import HomePage from "./pages/HomePage"; // 홈페이지 추가
import Header from "./components/common/Header"; // 경로 수정
import Footer from "./components/common/Footer"; // 경로 수정
import Sidebar from "./components/common/Sidebar"; // 경로 수정
import Project from "./pages/ProjectPage";
import ProjectPageCreate from "./pages/ProjectPageCreate";

import './App.css';

const App = () => (
  <Router>
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/home" element={<HomePage />} /> 
            <Route path="/project" element={<Project />} />
            <Route path="/project/create" element={<ProjectPageCreate />} /> 
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  </Router>
);

export default App;
