import React from "react";
import LoginForm from "../components/auth/LoginForm";
import "../styles/LoginPage.css";

const LoginPage: React.FC = () => {
  return (
    <>
      <h1 className="logo">TASKFLOW</h1>
      <h2 className="login-title">로그인</h2>

      <div className="login-container">
        <LoginForm />
        <div className="options">
          <a href="/login/findemail">이메일 찾기</a>
          <span className="divider">|</span>
          <a href="/login/resetpassword">비밀번호 재설정</a>
          <span className="divider">|</span>
          <a href="/signup">회원가입</a>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
