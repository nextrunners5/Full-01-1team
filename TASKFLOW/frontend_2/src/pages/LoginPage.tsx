import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
          }

          body {
            background-color: #f4f5fa;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }

          .container {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            text-align: center;
            width: 400px;
          }

          .logo {
            color: #4169e1;
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }

          .title {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            color: #333333;
          }

          .input-group {
            text-align: left;
            margin-bottom: 1.5rem;
          }

          .input-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333333;
            font-size: 0.9rem;
          }

          .input-group input {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1rem;
          }

          .password-wrapper {
            position: relative;
          }

          .eye-icon {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #999999;
            font-size: 1.2rem;
          }

          .login-btn {
            background-color: #4169e1;
            color: white;
            border: none;
            padding: 0.8rem;
            width: 100%;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
          }

          .login-btn:hover {
            background-color: #3558c8;
          }

          .options {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #666666;
          }

          .options a {
            text-decoration: none;
            color: #4169e1;
          }

          .options a:hover {
            text-decoration: underline;
          }
        `}
      </style>

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
    </>
  );
};

export default LoginPage; 