import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import { useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/schedule"
          element={isAuthenticated ? <SchedulePage /> : <Navigate to="/" />}
        />
        {/* 다른 라우트 추가 */}
      </Routes>
    </Router>
  );
};

export default App;