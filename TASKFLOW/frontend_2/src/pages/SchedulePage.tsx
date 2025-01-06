import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import ScheduleModal from '../components/modals/ScheduleModal';
import { scheduleApi, ScheduleData } from '../services/scheduleApi';
import '../styles/SchedulePage.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Schedule {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const fetchSchedules = async () => {
    try {
      const response = await scheduleApi.getSchedules();
      setSchedules(response);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (data: ScheduleData): Promise<void> => {
    try {
      if (!data.start || !data.end) {
        throw new Error('시작 시간과 종료 시간을 입력해주세요');
      }

      try {
        await scheduleApi.createSchedule({
          title: data.title,
          description: data.description,
          start_date: data.start.toISOString(),
          end_date: data.end.toISOString()
        });
        toast.success('새로운 일정이 추가되었습니다! ✨');
        handleCloseModal();
        fetchSchedules();
      } catch (error) {
        toast.error('일정 생성에 실패했습니다. 다시 시도해주세요.');
        throw new Error('일정 생성 실패');
      }
    } catch (error) {
      console.error('Failed to save schedule:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('일정 저장에 실패했습니다.');
      }
      throw error;
    }
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
                  <span>{schedule.start_date}</span>
                  <span> - </span>
                  <span>{schedule.end_date}</span>
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && (
            <ScheduleModal
              onSave={handleSave}
              onClose={handleCloseModal}
              isOpen={isModalOpen}
            />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SchedulePage; 