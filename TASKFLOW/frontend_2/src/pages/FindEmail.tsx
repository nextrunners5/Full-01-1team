import React, { useState } from "react";
import axios from "axios";

const FindEmailPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [birthNumber1, setBirthNumber1] = useState<string>("");
  const [birthNumber2, setBirthNumber2] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !birthNumber1 || !birthNumber2) {
      setError("모든 입력란을 채워주세요.");
      return;
    }

    const birthRegex = /^[0-9]{6}$/;
    const secondPartRegex = /^[0-9]{7}$/;

    if (!birthRegex.test(birthNumber1) || !secondPartRegex.test(birthNumber2)) {
      setError("주민등록번호 형식이 올바르지 않습니다.");
      return;
    }

    setError(null);
    setSuccessMessage(null);

    // 서버로 데이터 전송
    try {
      const response = await axios.post(
        "https://your-api-endpoint.com/find-email",
        {
          name,
          birthNumber: `${birthNumber1}-${birthNumber2}`
        }
      );

      // 성공 응답 처리
      if (response.data?.email) {
        setSuccessMessage(`이메일 찾기 성공: ${response.data.email}`);
      } else {
        setError("일치하는 이메일이 없습니다.");
      }
    } catch (err) {
      // 에러 처리
      setError("서버와 통신 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center"
      }}
    >
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
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="birthNumber">주민등록번호</label>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <input
              type="text"
              id="birthNumber1"
              value={birthNumber1}
              onChange={(e) => setBirthNumber1(e.target.value)}
              style={{ flex: 1, padding: "0.5rem" }}
              placeholder="YYMMDD"
              maxLength={6}
            />
            <span>-</span>
            <input
              type="text"
              id="birthNumber2"
              value={birthNumber2}
              onChange={(e) => setBirthNumber2(e.target.value)}
              style={{ flex: 1, padding: "0.5rem" }}
              placeholder="7자리"
              maxLength={7}
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
