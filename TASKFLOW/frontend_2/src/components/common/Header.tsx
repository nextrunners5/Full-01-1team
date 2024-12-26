import React from 'react';
import BellIcon from '../../assets/bell-icon.png';
import UserIcon from '../../assets/user-icon.png';
import '../../styles/Header.css';

const Header: React.FC = () => {
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