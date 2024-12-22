import React from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/HomePage.css'; // 경로 수정

import Header from '../components/common/Header'; // 경로 수정
import Footer from '../components/common/Footer'; // 경로 수정
import Sidebar from '../components/common/Sidebar'; // 경로 수정

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  { title: "주간 회의", start: new Date(2024, 3, 5, 10, 0), end: new Date(2024, 3, 5, 11, 0) },
  { title: "팀 미팅", start: new Date(2024, 3, 5, 14, 0), end: new Date(2024, 3, 5, 15, 0) },
  { title: "고객 프레젠테이션", start: new Date(2024, 3, 6, 16, 0), end: new Date(2024, 3, 6, 17, 0) },
];

const CustomToolbar = (toolbar) => {
  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  const changeView = (view) => toolbar.onView(view);

  return (
    <div className="toolbar-container">
      <div className="toolbar-center">
        <button className="navigate-btn" onClick={goToBack}>&lt;</button>
        <span className="current-month">{toolbar.label}</span>
        <button className="navigate-btn" onClick={goToNext}>&gt;</button>
      </div>
      <div className="view-switcher">
        <button onClick={() => changeView(Views.MONTH)} className="view-btn">Month</button>
        <button onClick={() => changeView(Views.WEEK)} className="view-btn">Week</button>
        <button onClick={() => changeView(Views.DAY)} className="view-btn">Today</button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.toLocaleString("default", { weekday: "long" });

  return (
    <div className="app-container">
      <div className="main-container">
        <main className="content">
          <section className="to-do-list" aria-label="To-do list">
            <h3>TO-DO LIST</h3>
            <ul>
              <li><label><input type="checkbox" /> 프로젝트 제안서 검토</label></li>
              <li><label><input type="checkbox" /> 오후 2시 팀 미팅</label></li>
              <li><label><input type="checkbox" /> 주간 보고서 업데이트</label></li>
              <li><label><input type="checkbox" /> 고객 프레젠테이션 준비</label></li>
            </ul>
          </section>

          <section className="today" aria-label="Today schedule">
            <h3>TODAY</h3>
            <p className="date">{`${currentDate.toLocaleDateString()} (${dayOfWeek})`}</p>
            <ul>
              <li>10:00 AM - 주간 회의</li>
              <li>2:00 PM - 팀 미팅</li>
              <li>4:00 PM - 고객 미팅</li>
            </ul>
          </section>

          <section className="project-status" aria-label="Project status">
            <h3>PROJECT STATUS</h3>
            <ul>
              <li>웹사이트 리뉴얼 <span className="status">진행중</span></li>
              <li>모바일 앱 개발 <span className="status">진행중</span></li>
              <li>마케팅 캠페인 <span className="status">진행중</span></li>
            </ul>
          </section>

          <section className="calendar" aria-label="Calendar">
            <h3>MONTH</h3>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView={Views.MONTH}
              views={{ month: true, week: true, day: true }}
              className="calendar-container"
              components={{ toolbar: CustomToolbar }}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
