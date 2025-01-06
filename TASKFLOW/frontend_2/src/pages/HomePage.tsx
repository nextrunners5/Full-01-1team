import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar,
  dateFnsLocalizer,
  ToolbarProps,
  View, // 문자열로 뷰 지정 시 필요할 수 있음
} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import '../styles/HomePage.css';
import '../styles/ProjectPage.css';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';
import { scheduleApi, Schedule, TodaySchedule } from '../services/scheduleApi';
import ScheduleModal, { ScheduleData } from '../components/modals/ScheduleModal';
import ScheduleDetailModal from '../components/modals/ScheduleDetailModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

// 달력 초기화
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// 달력 이벤트 타입
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

// 프로젝트 상태 타입
interface ProjectStatus {
  id: number;
  name: string;
  status: string;
}

// 커스텀 툴바(옵션)
const CustomToolbar: FC<ToolbarProps> = (props) => {
  const goToBack = () => props.onNavigate('PREV');
  const goToNext = () => props.onNavigate('NEXT');

  return (
    <div className="toolbar-container">
      <div className="toolbar-center">
        <button className="navigate-btn" onClick={goToBack}>
          &lt;
        </button>
        <span className="current-month">{props.label}</span>
        <button className="navigate-btn" onClick={goToNext}>
          &gt;
        </button>
      </div>
    </div>
  );
};

const HomePage: FC = () => {
  const navigate = useNavigate();

  // ---------------------
  // 1) State 정의
  // ---------------------
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [todayInfo, setTodayInfo] = useState<TodaySchedule | null>(null);
  const [projectList, setProjectList] = useState<ProjectStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [modalMode, setModalMode] = useState<'detail' | 'edit' | 'create'>('create');

  // 날짜/요일 표시에 사용할 값
  const currentDate = new Date();
  const dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' });

  // ---------------------
  // 2) useEffect를 통한 백엔드 연동
  // ---------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 오늘의 일정 가져오기
        const todaySchedules = await scheduleApi.getTodaySchedules();
        setTodayInfo(todaySchedules);

        // 달력 이벤트 가져오기
        const response = await scheduleApi.getSchedules();
        const fetchedEvents = response.map(schedule => ({
          title: schedule.title,
          start: new Date(schedule.start_date),
          end: new Date(schedule.end_date)
        }));
        setEvents(fetchedEvents);

        // 프로젝트 상태 가져오기
        const projectResponse = await axios.get('/api/projects');
        setProjectList(projectResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 달력 빈 영역 클릭 시 Monthly 페이지로 이동
  const handleCalendarClick = (event: React.MouseEvent) => {
    if (!(event.target instanceof HTMLButtonElement)) {
      navigate('/Schedule/Monthly');
    }
  };

  const handleAddClick = () => {
    setSelectedSchedule(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleScheduleClick = (schedule: TodaySchedule['schedules'][0]) => {
    const scheduleDetail: Schedule = {
      id: schedule.id,
      title: schedule.title,
      description: '',  // 기본값
      start_date: schedule.start_date,
      end_date: schedule.end_date
    };
    setSelectedSchedule(scheduleDetail);
    setModalMode('detail');
    setShowModal(true);
  };

  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSchedule(null);
    setModalMode('create');
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

      if (scheduleData.id) {
        await scheduleApi.updateSchedule(scheduleData.id, {
          title: scheduleData.title,
          description: scheduleData.description,
          start_date: scheduleData.start.toISOString(),
          end_date: scheduleData.end.toISOString()
        });
        toast.success('일정이 수정되었습니다! 🔄');
      } else {
        await scheduleApi.createSchedule({
          title: scheduleData.title,
          description: scheduleData.description,
          start_date: scheduleData.start.toISOString(),
          end_date: scheduleData.end.toISOString()
        });
        toast.success('새로운 일정이 추가되었습니다! ✨');
      }

      // 일정 목록과 달력 이벤트 모두 새로고침
      const [todaySchedules, allSchedules] = await Promise.all([
        scheduleApi.getTodaySchedules(),
        scheduleApi.getSchedules()
      ]);

      setTodayInfo(todaySchedules);
      setEvents(allSchedules.map(schedule => ({
        title: schedule.title,
        start: new Date(schedule.start_date),
        end: new Date(schedule.end_date)
      })));

      handleCloseModal();
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('일정 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    try {
      await scheduleApi.deleteSchedule(id);
      
      // 일정 목록과 달력 이벤트 모두 새로고침
      const [todaySchedules, allSchedules] = await Promise.all([
        scheduleApi.getTodaySchedules(),
        scheduleApi.getSchedules()
      ]);

      setTodayInfo(todaySchedules);
      setEvents(allSchedules.map(schedule => ({
        title: schedule.title,
        start: new Date(schedule.start_date),
        end: new Date(schedule.end_date)
      })));

      handleCloseModal();
      toast.success('일정이 삭제되었습니다! 🗑️');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('일정 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // ---------------------
  // 3) 렌더링
  // ---------------------
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <main className="content">
          {/* TODAY */}
          <section className="today" aria-label="Today schedule">
            <div className="today-header">
              <h3>오늘의 일정</h3>
              <button className="add-schedule-btn" onClick={handleAddClick}>
                +
              </button>
            </div>
            {isLoading ? (
              <div className="loading">로딩 중...</div>
            ) : (
              <>
                <p className="date">
                  {todayInfo?.date} ({todayInfo?.dayOfWeek})
                </p>
                <div className="schedule-list">
                  {todayInfo?.schedules.length === 0 ? (
                    <div className="no-schedule">오늘 예정된 일정이 없습니다.</div>
                  ) : (
                    <ul>
                      {todayInfo?.schedules.map((schedule) => (
                        <li 
                          key={`${schedule.time}-${schedule.title}`}
                          onClick={() => handleScheduleClick(schedule)}
                        >
                          <span className="schedule-time">{schedule.time}</span>
                          <span className="schedule-title">{schedule.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </section>

          {/* PROJECT STATUS */}
          <section className="project-status" aria-label="Project status">
            <h3>PROJECT STATUS</h3>
            <ul>
              {projectList.map((project) => (
                <li key={project.id}>
                  {project.name}{' '}
                  <span className="status">{project.status}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CALENDAR */}
          <section className="calendar" aria-label="Calendar">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              views={['month']}
              className="calendar-container"
              components={{ toolbar: CustomToolbar }}
              selectable={true}
              onSelectSlot={handleSlotSelect}
              onSelectEvent={handleScheduleClick}
              messages={{
                next: "다음",
                previous: "이전",
                today: "오늘",
                month: "월",
                noEventsInRange: "일정이 없습니다."
              }}
            />
          </section>
        </main>
        <Footer />

        {/* 모달 */}
        {showModal && (
          modalMode === 'detail' && selectedSchedule ? (
            <ScheduleDetailModal
              schedule={{
                id: selectedSchedule.id,
                title: selectedSchedule.title,
                description: selectedSchedule.description || '',
                start: selectedSchedule.start_date ? new Date(selectedSchedule.start_date) : new Date(),
                end: selectedSchedule.end_date ? new Date(selectedSchedule.end_date) : new Date()
              }}
              onClose={handleCloseModal}
              onEdit={handleEditClick}
              onDelete={() => handleDeleteSchedule(selectedSchedule.id)}
            />
          ) : (
            <ScheduleModal
              onClose={handleCloseModal}
              onSave={handleSaveSchedule}
              initialData={modalMode === 'edit' && selectedSchedule ? {
                id: selectedSchedule.id,
                title: selectedSchedule.title,
                description: selectedSchedule.description,
                start: selectedSchedule.start_date ? new Date(selectedSchedule.start_date) : new Date(),
                end: selectedSchedule.end_date ? new Date(selectedSchedule.end_date) : new Date()
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
    </div>
  );
};

export default HomePage;
