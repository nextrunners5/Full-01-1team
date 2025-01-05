import React, { useState } from "react";
import { findEmail } from "../api/findemailApi";

const FindEmailPage: React.FC = () => {
  const [name, setName] = useState("");
  const [birthNumberFront, setBirthNumberFront] = useState("");
  const [birthNumberBack, setBirthNumberBack] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // 입력값 검증
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (birthNumberFront.length !== 6 || birthNumberBack.length !== 7) {
      setError('올바른 주민등록번호를 입력해주세요.');
      return;
    }

    try {
      const fullBirthNumber = `${birthNumberFront}-${birthNumberBack}`;
      console.log('Sending request with:', { name, birthNumber: fullBirthNumber });
      
      const response = await findEmail(name, fullBirthNumber);
      console.log('Response:', response);
      
      if (response.success) {
        setSuccessMessage(`찾은 이메일: ${response.email}`);
      }
    } catch (error: any) {
      console.error('Error details:', error);
      setError(error.message);
    }
  };

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "400px",
      margin: "0 auto",
      textAlign: "center"
    }}>
      <h1>이메일 찾기</h1>
      <p>
        휴대폰 인증 없이 아래의 대체 인증 방법 중 하나를 선택하여 이메일을
        찾으실 수 있습니다.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.5rem"
            }}
            placeholder="이름 입력"
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="birthNumber">주민등록번호</label>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <input
              type="text"
              id="birthNumber1"
              value={birthNumberFront}
              onChange={(e) => setBirthNumberFront(e.target.value)}
              style={{ flex: 1, padding: "0.5rem" }}
              placeholder="YYMMDD"
              maxLength={6}
              required
            />
            <span>-</span>
            <input
              type="password"
              id="birthNumber2"
              value={birthNumberBack}
              onChange={(e) => setBirthNumberBack(e.target.value)}
              style={{ flex: 1, padding: "0.5rem" }}
              placeholder="●●●●●●●"
              maxLength={7}
              required
            />
          </div>
        </div>

        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        {successMessage && (
          <p style={{ color: "green", marginBottom: "1rem" }}>
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: "#0056FF",
            color: "white",
            padding: "0.75rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            marginTop: "1rem"
          }}
        >
          인증하기
        </button>
      </form>

      <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
        <p>
          🔒 본인 인증 시 제공되는 정보는 인증 이외의 용도로 이용 또는 저장되지
          않습니다.
        </p>
        <p>✅ 개인정보는 안전하게 암호화되어 처리됩니다.</p>
      </div>
    </div>
  );
};

export default FindEmailPage;
