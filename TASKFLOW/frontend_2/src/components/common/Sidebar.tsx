import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="sidebar">
      <div className="logo">
        <Link to="/home">TASKFLOW</Link>
      </div>
      <ul className="menu">
        <li className={`menu-item ${location.pathname === '/home' ? 'active' : ''}`}>
          <Link to="/home">홈</Link>
        </li>
        <li className={`menu-item ${location.pathname.includes('/schedule') ? 'active' : ''}`}>
          <Link to="/schedule">일정</Link>
          <ul className="submenu">
            <li className="submenu-item">
              <Link to="/schedule/monthly">월간</Link>
            </li>
            <li className="submenu-item">
              <Link to="/schedule/weekly">주간</Link>
            </li>
          </ul>
        </li>
        <li className={`menu-item ${location.pathname.includes('/project') ? 'active' : ''}`}>
          <Link to="/project">프로젝트</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar; 