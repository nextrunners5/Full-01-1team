import React, { useState } from "react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            width: 800px;
          }

          .logo {
            font-size: 2rem;
            font-weight: bold;
            color: #4169e1;
            text-align: left;
            margin-bottom: 1rem;
          }

          .title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            text-align: left;
          }

          .subtitle {
            font-size: 0.9rem;
            color: #777;
            margin-bottom: 2rem;
            text-align: left;
          }

          .input-group {
            text-align: left;
            margin-bottom: 1.5rem;
          }

          .input-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-size: 0.9rem;
          }

          .input-group input {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1rem;
          }

          .input-group input::placeholder {
            color: #aaa;
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
            color: #999;
            font-size: 1.2rem;
          }

          .gender-group {
            margin-bottom: 1rem;
          }

          .gender-group label {
            margin-right: 1rem;
            font-size: 0.9rem;
          }

          .checkbox-group {
            text-align: left;
            margin-top: 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
          }

          .checkbox-group input {
            margin-right: 0.3rem;
          }

          .submit-btn {
            background-color: #4169e1;
            color: white;
            border: none;
            padding: 1rem;
            width: 100%;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            font-weight: bold;
          }

          .submit-btn:hover {
            background-color: #3558c8;
          }

          .footer {
            margin-top: 2rem;
            font-size: 0.8rem;
            color: #999;
            text-align: center;
          }
        `}
      </style>

      <div className="container">
        <h1 className="logo">TASKFLOW</h1>
        <h2 className="title">회원가입</h2>
        <p className="subtitle">서비스 이용을 위해 회원가입이 필요합니다</p>

        <form>
          <div className="input-group">
            <label htmlFor="email">이메일 주소</label>
            <input type="email" id="email" placeholder="example@email.com" />
          </div>

          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="영문, 숫자, 특수문자 포함 8-20자"
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

          <div className="input-group">
            <label htmlFor="password-confirm">비밀번호 확인</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password-confirm"
                placeholder="비밀번호를 다시 입력해주세요"
              />
              <span
                className="eye-icon"
                onClick={toggleConfirmPasswordVisibility}
                role="button"
                aria-label="비밀번호 확인 보기"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="nickname">이름 (닉네임)</label>
            <input type="text" id="nickname" placeholder="이름 입력" />
          </div>

          <div className="input-group">
            <label htmlFor="birthdate">생년월일</label>
            <input type="date" id="birthdate" />
          </div>

          <div className="gender-group">
            <label>
              <input type="radio" name="gender" value="male" /> 남성
            </label>
            <label>
              <input type="radio" name="gender" value="female" /> 여성
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="id-number">주민등록번호</label>
            <input type="text" id="id-number" placeholder="주민등록번호 입력" />
          </div>

          <div className="checkbox-group">
            <label>
              <input type="checkbox" required /> 개인정보 수집 및 이용 동의
              (필수)
            </label>
            <label>
              <input type="checkbox" required /> 제3자 정보제공 동의 (필수)
            </label>
          </div>

          <button type="submit" className="submit-btn">
            회원가입 완료
          </button>
        </form>
      </div>

      <footer className="footer">ⓒ 2024 TASKFLOW. All rights reserved.</footer>
    </>
  );
};

export default Signup;
