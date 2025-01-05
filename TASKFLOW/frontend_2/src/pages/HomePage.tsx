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

// TO-DO 항목 타입
interface TodoItem {
  id: number;
  title: string;
  checked: boolean;
}

// 오늘 일정 타입(간단 예시)
interface TodaySchedule {
  date: string;           // YYYY-MM-DD
  dayOfWeek: string;      // 예: "Sunday"
  schedules: {
    time: string;         // 예: "10:00 AM"
    title: string;        // 예: "주간 회의"
  }[];
}

// 프로젝트 상태 타입
interface ProjectStatus {
  id: number;
  name: string;
  status: string;         // 예: "진행중", "완료" 등
}

// 커스텀 툴바(옵션)
const CustomToolbar: FC<ToolbarProps> = (props) => {
  const goToBack = () => props.onNavigate('PREV');
  const goToNext = () => props.onNavigate('NEXT');

  const changeView = (view: string) => {
    props.onView(view as View);
  };

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
      <div className="view-switcher">
        <button onClick={() => changeView('month')} className="view-btn">
          Month
        </button>
        <button onClick={() => changeView('week')} className="view-btn">
          Week
        </button>
        <button onClick={() => changeView('day')} className="view-btn">
          Today
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
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [todayInfo, setTodayInfo] = useState<TodaySchedule | null>(null);
  const [projectList, setProjectList] = useState<ProjectStatus[]>([]);

  // 날짜/요일 표시에 사용할 값
  const currentDate = new Date();
  const dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' });

  // ---------------------
  // 2) useEffect를 통한 백엔드 연동
  // ---------------------
  useEffect(() => {
    // (a) 달력 이벤트
    axios
      .get('/api/events')
      .then((res) => {
        // 백엔드에서 반환한 이벤트(문자열 날짜)를 실제 Date 객체로 변환
        const fetchedEvents: CalendarEvent[] = res.data.map((item: any) => ({
          title: item.title,
          // 문자열 -> Date 변환
          start: new Date(item.start),
          end: new Date(item.end),
        }));
        setEvents(fetchedEvents);
      })
      .catch((err) => console.error('Failed to fetch events:', err));

    // (b) TO-DO LIST
    axios
      .get('/api/todos')
      .then((res) => {
        setTodoItems(res.data);
      })
      .catch((err) => console.error('Failed to fetch todos:', err));

    // (c) TODAY 일정
    axios
      .get('/api/today')
      .then((res) => {
        setTodayInfo(res.data);
      })
      .catch((err) => console.error('Failed to fetch today schedule:', err));

    // (d) 프로젝트 상태
    axios
      .get('/api/projects')
      .then((res) => {
        setProjectList(res.data);
      })
      .catch((err) => console.error('Failed to fetch projects:', err));
  }, []);

  // 달력 빈 영역 클릭 시 Monthly 페이지로 이동
  const handleCalendarClick = (event: React.MouseEvent) => {
    if (!(event.target instanceof HTMLButtonElement)) {
      navigate('/Schedule/Monthly');
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
          {/* (A) TO-DO LIST */}
          <section className="to-do-list" aria-label="To-do list">
            <h3>TO-DO LIST</h3>
            <ul>
              {todoItems.map((item) => (
                <li key={item.id}>
                  <label>
                    <input type="checkbox" checked={item.checked} readOnly />
                    {item.title}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {/* (B) TODAY */}
          <section className="today" aria-label="Today schedule">
            <h3>TODAY</h3>
            {/* 오늘 날짜/요일 표시는 로컬 Date 사용 or 백엔드에서 가져온 값 사용 가능 */}
            <p className="date">
              {todayInfo
                ? `${todayInfo.date} (${todayInfo.dayOfWeek})`
                : `${currentDate.toLocaleDateString()} (${dayOfWeek})`}
            </p>
            <ul>
              {todayInfo
                ? todayInfo.schedules.map((sched, index) => (
                    <li key={index}>
                      {sched.time} - {sched.title}
                    </li>
                  ))
                : null}
            </ul>
          </section>

          {/* (C) PROJECT STATUS */}
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

          {/* (D) CALENDAR */}
          <section className="calendar" aria-label="Calendar" onClick={handleCalendarClick}>
            <h3>MONTH</h3>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              views={['month', 'week', 'day']}
              className="calendar-container"
              components={{ toolbar: CustomToolbar }}
            />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
