import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/HomePage.css';
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const HomePage: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <div className="content">
          <div className="to-do-list">
            <h2>To Do List</h2>
            {/* To Do List 내용 */}
          </div>
          <div className="today">
            <h2>Today</h2>
            {/* Today 내용 */}
          </div>
          <div className="project-status">
            <h2>Project Status</h2>
            {/* Project Status 내용 */}
          </div>
          <div className="calendar">
            <Calendar
              localizer={localizer}
              events={[]}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;