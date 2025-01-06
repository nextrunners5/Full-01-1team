// TodayPage.tsx

import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { scheduleApi, Schedule, TodaySchedule, ScheduleData } from '../services/scheduleApi';
import ScheduleModal from '../components/modals/ScheduleModal';
import ScheduleDetailModal from '../components/modals/ScheduleDetailModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/TodayPage.css';

const TodayPage: React.FC = () => {
  const [todayInfo, setTodayInfo] = useState<TodaySchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [modalMode, setModalMode] = useState<'detail' | 'edit' | 'create'>('create');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const todaySchedules = await scheduleApi.getTodaySchedules();
        setTodayInfo(todaySchedules);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    setSelectedSchedule(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleScheduleClick = (schedule: TodaySchedule['schedules'][0]) => {
    const scheduleDetail: Schedule = {
      id: schedule.id,
      title: schedule.title,
      description: '',
      start_date: schedule.start_date,
      end_date: schedule.end_date
    };
    setSelectedSchedule(scheduleDetail);
    setModalMode('detail');
    setShowModal(true);
  };

  const handleEditClick = () => {
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSchedule(null);
  };

  const handleSaveSchedule = async (scheduleData: ScheduleData): Promise<void> => {
    try {
      if (!scheduleData.start || !scheduleData.end) {
        throw new Error('시작 시간과 종료 시간을 입력해주세요');
      }

      const payload = {
        title: scheduleData.title,
        description: scheduleData.description,
        start_date: scheduleData.start.toISOString(),
        end_date: scheduleData.end.toISOString()
      };

      if (scheduleData.id) {
        await scheduleApi.updateSchedule(scheduleData.id, payload);
        toast.success('일정이 수정되었습니다! 🔄');
      } else {
        await scheduleApi.createSchedule(payload);
        toast.success('새로운 일정이 추가되었습니다! ✨');
      }

      // 일정 목록 새로고침
      const todaySchedules = await scheduleApi.getTodaySchedules();
      setTodayInfo(todaySchedules);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('일정 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      await scheduleApi.deleteSchedule(scheduleId);
      
      // 일정 목록 새로고침
      const todaySchedules = await scheduleApi.getTodaySchedules();
      setTodayInfo(todaySchedules);
      
      setShowModal(false);
      toast.success('일정이 삭제되었습니다! 🗑️');
    } catch (error) {
      console.error('일정 삭제 중 오류 발생:', error);
      toast.error('일정 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <main className="today-content">
          <section className="today-schedule">
            <div className="today-header">
              <h2>오늘의 일정</h2>
              <button className="add-schedule-btn" onClick={handleAddClick}>
                +
              </button>
            </div>
            <div className="date-info">
              <h3>{todayInfo?.date}</h3>
              <p>{todayInfo?.dayOfWeek}</p>
            </div>
            {isLoading ? (
              <div className="loading">로딩 중...</div>
            ) : (
              <div className="schedule-list">
                {todayInfo?.schedules.length === 0 ? (
                  <div className="no-schedule">오늘 예정된 일정이 없습니다.</div>
                ) : (
                  <ul>
                    {todayInfo?.schedules.map((schedule) => (
                      <li 
                        key={`${schedule.time}-${schedule.title}`}
                        onClick={() => handleScheduleClick(schedule)}
                        className="schedule-item"
                      >
                        <span className="schedule-time">{schedule.time}</span>
                        <span className="schedule-title">{schedule.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
      
      {/* 모달 추가 */}
      {showModal && (
        modalMode === 'detail' && selectedSchedule ? (
          <ScheduleDetailModal
            schedule={{
              id: selectedSchedule.id,
              title: selectedSchedule.title,
              description: selectedSchedule.description || '',
              start: new Date(selectedSchedule.start_date),
              end: new Date(selectedSchedule.end_date)
            }}
            onClose={handleCloseModal}
            onEdit={handleEditClick}
            onDelete={() => {
              if (selectedSchedule?.id) {
                handleDeleteSchedule(selectedSchedule.id);
              }
            }}
          />
        ) : (
          <ScheduleModal
            onClose={handleCloseModal}
            onSave={handleSaveSchedule}
            initialData={modalMode === 'edit' && selectedSchedule ? {
              id: selectedSchedule.id,
              title: selectedSchedule.title,
              description: selectedSchedule.description,
              start: new Date(selectedSchedule.start_date),
              end: new Date(selectedSchedule.end_date)
            } : null}
            isOpen={showModal}
          />
        )
      )}

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default TodayPage;
