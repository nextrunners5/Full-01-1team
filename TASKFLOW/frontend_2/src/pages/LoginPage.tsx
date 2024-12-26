import React, { useState } from "react";
import "../styles/LoginPage.css"; // CSS 파일 임포트

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <h1 className="logo">TASKFLOW</h1>
      <h2 className="title">로그인</h2>
      <form className="login-form">
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
        <a href="#">이메일 찾기</a> | <a href="#">비밀번호 재설정</a> |{" "}
        <a href="/signup">회원가입</a>
      </div>
    </div>
  );
};

export default LoginPage; 