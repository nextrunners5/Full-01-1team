import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import SchedulePage from "./pages/SchedulePage.tsx";
import HomePage from "./pages/HomePage.tsx";
import ProjectPage from "./pages/ProjectPage.tsx";
import ProjectPageCreate from "./pages/ProjectPageCreate.tsx";
import ProjectPageEdit from "./pages/ProjectPageEdit.tsx"; // 파일명과 컴포넌트명 통일
import Header from "./components/common/Header.tsx";
import Sidebar from "./components/common/Sidebar.tsx";
import Footer from "./components/common/Footer.tsx";
import FindEmail from "./pages/FindEmail.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import PersonalInfoPage from "./pages/PersonalInfoUpdate.tsx";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login/findemail" element={<FindEmail />} />
      <Route path="/login/resetpassword" element={<ResetPassword />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/schedule"
        element={
          <Layout>
            <SchedulePage />
          </Layout>
        }
      />
      <Route
        path="/home"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/project"
        element={
          <Layout>
            <ProjectPage />
          </Layout>
        }
      />
      <Route
        path="/project/create"
        element={
          <Layout>
            <ProjectPageCreate />
          </Layout>
        }
      />

      <Route 
        path="/project/edit" 
        element={<Layout><ProjectPageEdit /></Layout>} 

      {/* 
        /project/edit 경로에서 사용할 컴포넌트를 ProjectPageEdit로 통일 
      */}
      <Route
        path="/project/edit"
        element={
          <Layout>
            <ProjectPageEdit />
          </Layout>
        }
      />

      <Route
        path="/personalinfo/update"
        element={
          <Layout>
            <PersonalInfoPage />
          </Layout>
        }

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