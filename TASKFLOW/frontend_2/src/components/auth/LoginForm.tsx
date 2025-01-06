import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../services/authApi';
import '../../styles/LoginForm.css';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authApi.login({ email, password });
      if (response.token) {
        login(response.token); // 토큰만 전달
        navigate('/home', { replace: true });
      }
    } catch (error: any) {
      setIsModalOpen(true);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-btn">
          로그인
        </button>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">로그인 실패</h2>
            <p className="modal-message">로그인에 실패했습니다.</p>
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