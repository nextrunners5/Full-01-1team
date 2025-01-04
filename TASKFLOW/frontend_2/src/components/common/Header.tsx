import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BellIcon from '../../assets/bell-icon.png';
import UserIcon from '../../assets/user-icon.png';
import '../../styles/Header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <h2 className="header-title">TASKFLOW</h2>
      <div className="user-area">
        <button className="notification-btn" aria-label="알림">
          <img src={BellIcon} alt="알림" />
        </button>
        <div className="user-profile">
          <button className="profile-btn" aria-label="프로필">
            <img src={UserIcon} alt="프로필" />
          </button>
          <span className="user-name">{user?.name}</span>
          <button className="logout-btn" onClick={logout}>
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 