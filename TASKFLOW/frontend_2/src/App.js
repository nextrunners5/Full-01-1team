import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SchedulePage from "./pages/SchedulePage"; // 일정 페이지 추가

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/schedule" element={<SchedulePage />} /> {/* 일정 페이지 라우트 */}
    </Routes>
  </Router>
);

export default App;
