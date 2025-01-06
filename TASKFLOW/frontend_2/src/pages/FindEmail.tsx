import React, { useState } from "react";
import { findEmail } from "../api/findemailApi";

import axios from "axios";
import "../styles/FindEmail.css";

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

    try {
      const response = await findEmail(name, `${birthNumber1}-${birthNumber2}`);

      if (response?.email) {
        setSuccessMessage(`이메일 찾기 성공: ${response.email}`);
      } else {
        setError("일치하는 이메일이 없습니다.");
      }
    } catch (err) {
      setError("서버와 통신 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  return (
    <div className="find-email-container">
      <h1>이메일 찾기</h1>
      <p>
        휴대폰 인증 없이 아래의 대체 인증 방법 중 하나를 선택하여 이메일을
        찾으실 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="form-group-FE">
        <div className="inputGroup-info">
          <label htmlFor="name" className="label">
            이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="이름 입력"
          />
        </div>

        <div className="inputGroup-info">
          <label htmlFor="birthNumber" className="label">
            주민등록번호
          </label>
          <div className="birthNumberContainer">
            <input
              type="text"
              id="birthNumber1"
              value={birthNumber1}
              onChange={(e) => setBirthNumber1(e.target.value)}
              className="inputHalf"
              placeholder="YYMMDD"
              maxLength={6}
            />
            <span className="hyphen">-</span>
            <input
              type="password"
              id="birthNumber2"
              value={birthNumber2}
              onChange={(e) => setBirthNumber2(e.target.value)}
              className="inputHalf"
              placeholder="7자리"
              maxLength={7}
            />
          </div>
        </div>

        {error && <p className="errorMsg">{error}</p>}
        {successMessage && <p className="successMsg">{successMessage}</p>}

        <button type="submit" className="submitBtn">
          인증하기
        </button>
      </form>

      <div className="notice">
        <p>🔒 본인 인증 시 제공되는 정보는 인증 이외의 용도로 이용 또는 저장되지 않습니다.</p>
        <p>✅ 개인정보는 안전하게 암호화되어 처리됩니다.</p>
      </div>
    </div>
  );
};

export default FindEmailPage;