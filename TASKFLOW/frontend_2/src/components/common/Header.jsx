import React from 'react';
import BellIcon from '../../assets/bell-icon.png'; // 경로 수정
import UserIcon from '../../assets/user-icon.png'; // 경로 수정
import '../../styles/Header.css'; // CSS 경로 수정

const Header = () => {
  return (
    <header className="header">
      <h2></h2>
      <div className="user-area">
        <button className="notification" aria-label="Notifications">
          <img src={BellIcon} alt="Notifications" />
        </button>
        <button className="user-icon" aria-label="User Profile">
          <img src={UserIcon} alt="User Profile" />
        </button>
      </div>
    </header>
  );
};

export default Header;

