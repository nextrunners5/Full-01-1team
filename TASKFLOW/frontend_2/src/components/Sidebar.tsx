import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="sidebar">
      <div className="logo">
        <Link to="/home">
          <img src="/logo.png" alt="TASKFLOW" />
        </Link>
      </div>
      <ul className="menu">
        <li>
          <Link 
            to="/home" 
            className={`menu-item ${location.pathname === '/home' ? 'active' : ''}`}
          >
            <span className="icon">🏠</span>
            홈
          </Link>
        </li>
        <li>
          <Link 
            to="/schedule" 
            className={`menu-item ${location.pathname.includes('/schedule') ? 'active' : ''}`}
          >
            <span className="icon">📅</span>
            일정
          </Link>
          <ul className="submenu">
            <li className="submenu-item">
              <Link to="/schedule/monthly">월간</Link>
            </li>
            <li className="submenu-item">
              <Link to="/schedule/weekly">주간</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link 
            to="/project" 
            className={`menu-item ${location.pathname.includes('/project') ? 'active' : ''}`}
          >
            <span className="icon">📋</span>
            프로젝트
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar; 