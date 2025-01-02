import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; // CSS 파일 임포트

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    // Mock validation (replace with real API call)
    if (email !== "test@example.com" || password !== "password123") {
      setIsModalOpen(true); // Open modal if login fails
    } else {
      alert("로그인 성공"); // Placeholder for successful login
      navigate('/home'); // 로그인 성공 시 메인 페이지로 이동
    }
  };

  return (
    <div className="container">
      <h1 className="logo">TASKFLOW</h1>
      <h2 className="title">로그인</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" placeholder="이메일을 입력하세요" />
        </div>
        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="비밀번호를 입력하세요"
            />
            <span
              className="eye-icon"
              onClick={togglePasswordVisibility}
              role="button"
              aria-label="비밀번호 보기"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>
        <button type="submit" className="login-btn">
          로그인
        </button>
      </form>
      <div className="options">
        <a href="/login/findemail">이메일 찾기</a> | <a href="/login/resetpassword">비밀번호 재설정</a> | <a href="/signup">회원가입</a>
      </div>

      {/* Modal for Login Failure */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-top">
            <h2 className="modal-title">로그인 실패</h2>
            <p className="modal-message">이메일 또는 비밀번호가 일치하지 않습니다.</p>
            <button
              className="modal-button"
              onClick={() => setIsModalOpen(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage; 