import React, { useState } from 'react';
import LogoImage from '../../assets/logo.png';
import HomeIcon from '../../assets/home-icon.png';
import ScheduleIcon from '../../assets/schedule-icon.png';
import ProjectIcon from '../../assets/project-icon.png';
import ChatIcon from '../../assets/chat-icon.png';
import UserIcon from '../../assets/user-icon.png';
import '../../styles/Sidebar.css';

const Sidebar: React.FC = () => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={LogoImage} alt="TaskFlow Logo" />
      </div>
      <nav className="menu">
        <a href="/home" className="menu-item">
          <img src={HomeIcon} alt="Home" className="icon" /> HOME
        </a>
        <div className="menu-item dropdown1" onClick={() => setIsScheduleOpen(!isScheduleOpen)}>
          <img src={ScheduleIcon} alt="Schedule Management" className="icon" /> SCHEDULE MANAGEMENT
        </div>
        {isScheduleOpen && (
          <ul className="submenu">
            <li className="submenu-item"><a href="/schedule/monthly">Monthly</a></li>
            <li className="submenu-item"><a href="/schedule/weekly">Weekly</a></li>
            <li className="submenu-item"><a href="/schedule/today">Today</a></li>
          </ul>
        )}
        <a href="/project" className="menu-item">
          <img src={ProjectIcon} alt="Project" className="icon" /> PROJECT
        </a>
        <a href="/chat" className="menu-item">
          <img src={ChatIcon} alt="Chat" className="icon" /> CHAT
        </a>
        <a href="/mypage" className="menu-item">
          <img src={UserIcon} alt="My Page" className="icon" /> MY PAGE
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar; 