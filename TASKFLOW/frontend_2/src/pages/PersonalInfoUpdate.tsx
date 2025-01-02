import React, { useState } from "react";
import "../styles/PersonalInfoPage.css"; // CSS 파일 임포트

const PersonalInfoPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "홍길동",
    email: "hong@example.com",
    phone: "010-1234-5678",
    newPassword: "",
    confirmPassword: "",
    emailAlerts: true,
    smsAlerts: true,
    pushAlerts: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to save updated personal information
    alert("개인정보가 성공적으로 저장되었습니다.");
  };

  return (
    <div className="container">
      <h1 className="title">개인정보 수정</h1>
      <p className="subtitle">회원님의 개인정보를 안전하게 관리하세요.</p>

      <form className="info-form" onSubmit={handleSave}>
        <div className="input-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="phone">전화번호</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="alerts-group">
          <h3>알림 설정</h3>
          <label className="switch">
            <input
              type="checkbox"
              name="emailAlerts"
              checked={formData.emailAlerts}
              onChange={handleChange}
            />
            <span className="slider"></span>
            이메일 알림
          </label>

          <label className="switch">
            <input
              type="checkbox"
              name="smsAlerts"
              checked={formData.smsAlerts}
              onChange={handleChange}
            />
            <span className="slider"></span>
            SMS 알림
          </label>

          <label className="switch">
            <input
              type="checkbox"
              name="pushAlerts"
              checked={formData.pushAlerts}
              onChange={handleChange}
            />
            <span className="slider"></span>
            푸시 알림
          </label>
        </div>

        <div className="button-group">
          <button type="button" className="cancel-button">
            취소
          </button>
          <button type="submit" className="save-button">
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoPage;
