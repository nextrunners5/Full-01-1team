import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/authApi";
import "../styles/ResetPassword.css";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [step, setStep] = useState<"email" | "password" | "reset">("email");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !name) {
      setError("이메일과 이름을 모두 입력해주세요.");
      return;
    }

    try {
      const response = await authApi.verifyUserForReset(email, name);
      
      if (response.success) {
        setStep("password");
      } else {
        setError("이메일 또는 이름이 일치하지 않습니다.");
      }
    } catch (error: any) {
      setError(error.message || "사용자 정보 확인에 실패했습니다.");
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("비밀번호와 비밀번호 확인을 모두 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const response = await authApi.resetPassword(email, name, password);
      if (response.success) {
        setSuccess(response.message);
        alert("비밀번호가 성공적으로 재설정되었습니다. 로그인 페이지로 이동합니다.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <h1 className="reset-password-title">TASKFLOW</h1>

      <div className="reset-password-container">
        {step === "email" ? (
          <>
            <h2 className="reset-password-subtitle">비밀번호 재설정</h2>
            <p className="reset-password-description">
              가입 시 등록한 이메일을 확인 후 비밀번호를 재설정하실 수 있습니다.
            </p>
            <form onSubmit={handleSubmitEmail} className="reset-password-form">
              <div className="form-group">
                <label htmlFor="email">이메일 주소</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="example@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="홍길동"
                />
              </div>
              <button type="submit">
                확인하기
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="reset-password-subtitle">새 비밀번호 설정</h2>
            <form onSubmit={handleSubmitPassword} className="reset-password-form">
              <div className="form-group">
                <label htmlFor="password">새 비밀번호</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="비밀번호 입력"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="비밀번호 다시 입력"
                />
              </div>
              <button type="submit">
                비밀번호 재설정
              </button>
            </form>
          </>
        )}

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </>
  );
};

export default ResetPassword;
