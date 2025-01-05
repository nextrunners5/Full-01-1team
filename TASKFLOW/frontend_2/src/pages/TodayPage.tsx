// TodayPage.tsx

import React, { useState, useEffect, FC } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'; // Views 제거
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import '../styles/Today.css'; // 해당 파일이 없을 경우 주석 처리 또는 삭제
import '../styles/TodayPage.css';

import { format as formatDate } from 'date-fns';
import scheduleApi, { Schedule, ScheduleResponse } from '../services/scheduleApi';
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer"; // 따옴표 수정

// 로케일 설정
const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

// 로컬라이저 초기화
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// 이벤트 타입 정의
interface Event {
  id: number;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

const TodayPage: FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 컴포넌트가 마운트 될 때 스타일 변경 및 이벤트 가져오기
  useEffect(() => {
    // body 스타일 설정
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = 'Arial, sans-serif';
    document.body.style.backgroundColor = '#F4F5FB';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflowX = 'hidden';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';

    // 이벤트 가져오기
    fetchEvents();

    // 컴포넌트 언마운트 시 스타일 복원 (선택사항)
    return () => {
      // 필요 시 스타일 복원 로직 추가
    };
  }, []);

  // 이벤트 API로부터 가져오기
  const fetchEvents = async () => {
    try {
      const today = new Date();
      const formattedDate = formatDate(today, 'yyyy-MM-dd');
      
      const response = await scheduleApi.getDailySchedules(formattedDate);
      
      const schedules: Event[] = response.map((schedule: ScheduleResponse) => ({
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        start: new Date(schedule.start_date),
        end: new Date(schedule.end_date),
      }));

      setEvents(schedules);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // 이벤트 생성 핸들러
  const handleCreateEvent = async (formData: any) => {
    try {
      const newEvent = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
      };

      const response = await scheduleApi.createSchedule(newEvent);
      
      const createdEvent: Event = {
        id: response.id,
        title: response.title,
        description: response.description,
        start: new Date(response.start_date),
        end: new Date(response.end_date),
      };

      setEvents([...events, createdEvent]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  // 이벤트 유효성 검사 및 기본값 설정
  const validatedEvents = events.map(event => ({
    title: event.title || 'Untitled Event',
    start: event.start || new Date(),
    end: event.end || new Date(),
  }));

  // 이벤트 선택 핸들러 (모달 열기 등 추가 가능)
  const handleSelectEvent = (event: Event) => { // 타입 정의 수정
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="Tapp-container">
      <Sidebar />
      <div className="Tmain-container">
        <Header />
        <div className="Tcontent">
          <section className="Tcalendar" aria-label="Today Calendar">
            <h3>Today</h3>
            <Calendar
              localizer={localizer}
              events={validatedEvents} // 유효성 검사된 이벤트 전달
              startAccessor="start"
              endAccessor="end"
              defaultView='day' // 문자열 리터럴 사용
              views={['day']} // 'day' 보기만 활성화
              className="Tcalendar-container"
              onSelectEvent={handleSelectEvent} // 이벤트 선택 시 핸들러 연결
            />
          </section>
          {/* 모달 컴포넌트 또는 추가적인 내용은 여기서 관리 */}
          {isModalOpen && selectedEvent && (
            <div className="ant-modal-content">
              <div className="ant-modal-body">
                <h2>{selectedEvent.title}</h2>
                <p>{selectedEvent.description}</p>
                <p>
                  시작: {selectedEvent.start.toLocaleString()} <br />
                  종료: {selectedEvent.end.toLocaleString()}
                </p>
                <button onClick={() => setIsModalOpen(false)}>닫기</button>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TodayPage;
