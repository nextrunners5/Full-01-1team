import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import ScheduleModal from '../components/modals/ScheduleModal';
import '../styles/SchedulePage.css';

interface Schedule {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (data: Schedule) => {
    setSchedules([...schedules, data]);
    handleCloseModal();
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="schedule-container">
          <div className="header-actions">
            <h2>일정 관리</h2>
            <div className="view-buttons">
              <button onClick={() => navigate('/schedule/monthly')}>
                월간 보기
              </button>
              <button onClick={() => navigate('/schedule/weekly')}>
                주간 보기
              </button>
              <button onClick={handleOpenModal} className="new-schedule-btn">
                새 일정 추가
              </button>
            </div>
          </div>

          <div className="schedules-list">
            {schedules.map((schedule, index) => (
              <div key={index} className="schedule-item">
                <h3>{schedule.title}</h3>
                <p>{schedule.description}</p>
                <div className="schedule-time">
                  <span>{schedule.startTime}</span>
                  <span> - </span>
                  <span>{schedule.endTime}</span>
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && (
            <ScheduleModal
              onSave={handleSave}
              onClose={handleCloseModal}
            />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SchedulePage; 