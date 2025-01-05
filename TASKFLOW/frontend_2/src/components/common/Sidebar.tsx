import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
        {/* 기존 <a href="/home">를 <Link to="/home">로 변경 */}
        <Link to="/home" className="menu-item">
          <img src={HomeIcon} alt="Home" className="icon" /> HOME
        </Link>

        {/* 기존 상태 관리 그대로 유지 */}
        <div className="menu-item dropdown1" onClick={() => setIsScheduleOpen(!isScheduleOpen)}>
          <img src={ScheduleIcon} alt="Schedule Management" className="icon" /> SCHEDULE MANAGEMENT
        </div>

        {isScheduleOpen && (
          <ul className="submenu">
            {/* 내부 <a href>를 <Link to>로 변경 */}
            <li className="submenu-item">
              <Link to="/schedule/monthly">Monthly</Link>
            </li>
            <li className="submenu-item">
              <Link to="/schedule/weekly">Weekly</Link>
            </li>
            <li className="submenu-item">
              <Link to="/schedule/today">Today</Link>
            </li>
          </ul>
        )}

        <Link to="/project" className="menu-item">
          <img src={ProjectIcon} alt="Project" className="icon" /> PROJECT
        </Link>
        <Link to="/mypage" className="menu-item">
          <img src={UserIcon} alt="My Page" className="icon" /> MY PAGE
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
