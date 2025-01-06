// TodayPage.tsx

import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { scheduleApi, Schedule } from '../services/scheduleApi';
import ScheduleModal, { ScheduleData } from '../components/modals/ScheduleModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Today.css';
import ScheduleDetailModal from '../components/modals/ScheduleDetailModal';

interface TodaySchedule {
  id: number;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

const TodayPage: React.FC = () => {
  const [todaySchedules, setTodaySchedules] = useState<TodaySchedule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<TodaySchedule | null>(null);
  const [modalMode, setModalMode] = useState<'detail' | 'edit' | 'create'>('create');

  const fetchTodaySchedules = async () => {
    try {
      const response = await scheduleApi.getSchedules();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayEvents = response
        .map((schedule: Schedule) => ({
          id: schedule.id,
          title: schedule.title,
          description: schedule.description,
          start: new Date(schedule.start_date),
          end: new Date(schedule.end_date)
        }))
        .filter(schedule => {
          const scheduleDate = new Date(schedule.start);
          scheduleDate.setHours(0, 0, 0, 0);
          return scheduleDate.getTime() === today.getTime();
        })
        .sort((a, b) => a.start.getTime() - b.start.getTime());

      setTodaySchedules(todayEvents);
    } catch (error) {
      console.error('Failed to fetch today schedules:', error);
    }
  };

  useEffect(() => {
    fetchTodaySchedules();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSaveSchedule = async (scheduleData: ScheduleData): Promise<void> => {
    try {
      if (!scheduleData.start || !scheduleData.end) {
        throw new Error('시작 시간과 종료 시간을 입력해주세요');
      }

      if (scheduleData.id) {
        // 수정
        try {
          const response = await scheduleApi.updateSchedule(scheduleData.id, {
            title: scheduleData.title,
            description: scheduleData.description,
            start_date: scheduleData.start.toISOString(),
            end_date: scheduleData.end.toISOString()
          });

          const updatedSchedule: TodaySchedule = {
            id: response.id,
            title: response.title,
            start: new Date(response.start_date),
            end: new Date(response.end_date),
            description: response.description || ''
          };

          setTodaySchedules(prev => 
            prev.map(schedule => 
              schedule.id === updatedSchedule.id ? updatedSchedule : schedule
            )
          );
          toast.success('일정이 성공적으로 수정되었습니다! 🔄');
        } catch (error) {
          toast.error('일정 수정에 실패했습니다. 다시 시도해주세요.');
          throw new Error('일정 수정 실패');
        }
      } else {
        // 생성
        try {
          const response = await scheduleApi.createSchedule({
            title: scheduleData.title,
            description: scheduleData.description,
            start_date: scheduleData.start.toISOString(),
            end_date: scheduleData.end.toISOString()
          });

          const newSchedule: TodaySchedule = {
            id: response.id,
            title: response.title,
            start: new Date(response.start_date),
            end: new Date(response.end_date),
            description: response.description || ''
          };
          
          setTodaySchedules(prev => [...prev, newSchedule].sort((a, b) => a.start.getTime() - b.start.getTime()));
          toast.success('새로운 일정이 추가되었습니다! ✨');
        } catch (error) {
          toast.error('일정 생성에 실패했습니다. 다시 시도해주세요.');
          throw new Error('일정 생성 실패');
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving schedule:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('일정 저장에 실패했습니다.');
      }
      throw error;
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    try {
      await scheduleApi.deleteSchedule(id);
      setTodaySchedules(prev => prev.filter(schedule => schedule.id !== id));
      handleCloseModal();
      toast.success('일정이 삭제되었습니다! 🗑️');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('일정 삭제에 실패했습니다. 다시 시도해주세요.');
      throw new Error('일정 삭제 실패');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSchedule(null);
  };

  const handleScheduleClick = (schedule: TodaySchedule) => {
    setSelectedSchedule(schedule);
    setModalMode('detail');
    setShowModal(true);
  };

  const handleEditClick = () => {
    setModalMode('edit');
  };

  const handleAddClick = () => {
    setSelectedSchedule(null);
    setModalMode('create');
    setShowModal(true);
  };

  return (
    <div className="today-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="today-container">
          <div className="today-header">
            <h2 className="today-title">오늘의 일정</h2>
            <button className="add-schedule-btn" onClick={handleAddClick}>
              + 새 일정
            </button>
          </div>
          <div className="today-date">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
          
          <div className="schedule-list">
            {todaySchedules.length === 0 ? (
              <div className="no-schedule">오늘 예정된 일정이 없습니다.</div>
            ) : (
              todaySchedules.map(schedule => (
                <div 
                  key={schedule.id} 
                  className="schedule-card"
                  onClick={() => handleScheduleClick(schedule)}
                >
                  <div className="schedule-time">
                    {formatTime(schedule.start)} - {formatTime(schedule.end)}
                  </div>
                  <div className="schedule-content">
                    <h3 className="schedule-title">{schedule.title}</h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <Footer />
      </div>

      {showModal && (
        modalMode === 'detail' ? (
          <ScheduleDetailModal
            schedule={selectedSchedule!}
            onClose={handleCloseModal}
            onEdit={handleEditClick}
            onDelete={() => handleDeleteSchedule(selectedSchedule!.id)}
          />
        ) : (
          <ScheduleModal
            onClose={handleCloseModal}
            onSave={handleSaveSchedule}
            initialData={modalMode === 'edit' ? selectedSchedule : null}
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
