import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/LoginForm.css';

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
      await login(email, password);
      navigate('/home', { replace: true });
    } catch (error: any) {
      setIsModalOpen(true);
      setError(error.message || '로그인에 실패했습니다.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">이메일</label>
          <input 
            type="email" 
            id="email" 
            placeholder="이메일을 입력하세요" 
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="비밀번호를 입력하세요"
              required
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">로그인 실패</h2>
            <p className="modal-message">{error}</p>
            <button
              className="modal-button"
              onClick={() => setIsModalOpen(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm; 