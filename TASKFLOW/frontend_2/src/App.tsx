import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import SchedulePage from "./pages/SchedulePage.tsx";
import HomePage from "./pages/HomePage.tsx";
import ProjectPage from "./pages/ProjectPage.tsx";
import ProjectPageCreate from "./pages/ProjectPageCreate.tsx";
import Header from "./components/common/Header.tsx";
import Sidebar from "./components/common/Sidebar.tsx";
import Footer from "./components/common/Footer.tsx";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/schedule" element={<Layout><SchedulePage /></Layout>} />
      <Route path="/home" element={<Layout><HomePage /></Layout>} />
      <Route path="/project" element={<Layout><ProjectPage /></Layout>} />
      <Route path="/project/create" element={<Layout><ProjectPageCreate /></Layout>} />
    </Routes>
  </Router>
);

const Layout: React.FC = ({ children }) => (
  <div>
    <Header />
    <Sidebar />
    <main>{children}</main>
    <Footer />
  </div>
);

export default App; 