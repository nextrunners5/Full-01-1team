import React, { useState } from 'react';
import LogoImage from '../../assets/logo.png'; // 경로 수정
import HomeIcon from '../../assets/home-icon.png'; // 경로 수정
import ScheduleIcon from '../../assets/schedule-icon.png'; // 경로 수정
import ProjectIcon from '../../assets/project-icon.png'; // 경로 수정
import ChatIcon from '../../assets/chat-icon.png'; // 경로 수정
import UserIcon from '../../assets/user-icon.png'; // 경로 수정
import '../../styles/Sidebar.css'; // CSS 경로 수정

const Sidebar = () => {
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

