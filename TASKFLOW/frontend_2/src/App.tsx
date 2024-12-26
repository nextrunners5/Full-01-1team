import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import SchedulePage from "./pages/SchedulePage.tsx";
import HomePage from "./pages/HomePage.tsx";
import Header from "./components/common/Header.tsx";
import Footer from "./components/common/Footer.tsx";
import Sidebar from "./components/common/Sidebar.tsx";
import Project from "./pages/ProjectPage.tsx";
import ProjectPageCreate from "./pages/ProjectPageCreate.tsx";

import './App.css';

const App: React.FC = () => (
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