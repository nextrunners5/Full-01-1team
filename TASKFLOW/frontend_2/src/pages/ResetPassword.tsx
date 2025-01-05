import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 입력값 검증
    if (!email || !name || !newPassword || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await authApi.resetPassword(email, name, newPassword);
      if (response.success) {
        setSuccess(response.message);
        alert('비밀번호가 성공적으로 재설정되었습니다. 로그인 페이지로 이동합니다.');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (error: any) {
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
      <h1>비밀번호 재설정</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.5rem"
            }}
            placeholder="이메일 입력"
            required
          />
        </div>
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
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.5rem"
            }}
            placeholder="새 비밀번호 입력"
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="confirmPassword">새 비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.5rem"
            }}
            placeholder="새 비밀번호 다시 입력"
            required
          />
        </div>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "1rem" }}>{success}</p>}
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
          비밀번호 재설정
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
