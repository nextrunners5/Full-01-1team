import React, { useState } from "react";
import "../styles/ResetPassword.css";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [step, setStep] = useState<"email" | "reset">("email"); // 이메일 단계 또는 비밀번호 재설정 단계
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      setError("이메일 주소와 이름을 모두 입력해주세요.");
      setSuccess(null);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      setSuccess(null);
      return;
    }

    // 이메일 확인 성공으로 가정 (실제 API 통합 시 요청 필요)
    setError(null);
    setSuccess("이메일 확인이 완료되었습니다. 비밀번호를 재설정해주세요.");
    setStep("reset"); // 비밀번호 재설정 단계로 이동
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("비밀번호와 비밀번호 확인을 모두 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 비밀번호 재설정 성공으로 가정 (실제 API 통합 시 요청 필요)
    setError(null);
    setSuccess("비밀번호가 성공적으로 재설정되었습니다.");
    setStep("email"); // 초기화 (필요 시 다른 페이지로 이동)
  };

  return (
    <div className="reset-password-container">
      <h1 className="reset-password-title">TASKFLOW</h1>
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
                className="input-field"
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
                className="input-field"
                placeholder="홍길동"
              />
            </div>
            <button type="submit" className="submit-button">
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
                className="input-field"
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
                className="input-field"
                placeholder="비밀번호 다시 입력"
              />
            </div>
            <button type="submit" className="submit-button">
              비밀번호 재설정
            </button>
          </form>
        </>
      )}

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default ResetPassword;
