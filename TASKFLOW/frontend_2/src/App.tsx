import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SchedulePage from "./pages/SchedulePage";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import ProjectPageCreate from "./pages/ProjectPageCreate";
import ProjectPageEdit from "./pages/ProjectPageEdit";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route 
        path="/schedule" 
        element={<Layout><SchedulePage /></Layout>} 
      />
      <Route 
        path="/home" 
        element={<Layout><HomePage /></Layout>} 
      />
      <Route 
        path="/project" 
        element={<Layout><ProjectPage /></Layout>} 
      />
      <Route 
        path="/project/create" 
        element={<Layout><ProjectPageCreate /></Layout>} 
      />
      <Route 
        path="/project/edit" 
        element={<Layout><ProjectPageEdit /></Layout>} 
      />
    </Routes>
  </Router>
);

// Layout 컴포넌트 수정
const Layout: React.FC = ({ children }) => (
  <div className="layout">
    <Sidebar />
    <Header />
    <main className="main">{children}</main>
    <Footer />
  </div>
);

export default App;