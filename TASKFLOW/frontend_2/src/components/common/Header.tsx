import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserIcon from '../../assets/user-icon.png';
import { LogOut } from 'lucide-react';
import '../../styles/Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/mypage');
  };

  return (
    <header className="header">
      <h2 className="header-title"></h2>
      <div className="user-area">
        <button 
          className="notification-btn logout-btn" 
          onClick={handleLogout}
          aria-label="로그아웃"
        >
          <LogOut size={20} />
        </button>
        <div className="user-profile">
          <button 
            className="profile-btn" 
            onClick={handleProfileClick}
            aria-label="프로필"
          >
            <img src={UserIcon} alt="프로필" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 