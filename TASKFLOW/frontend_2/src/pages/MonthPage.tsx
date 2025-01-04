import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Monthly.css';

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

interface Event {
  id?: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

const MonthPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent({ title: '', start, end });
    setShowModal(true);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <div className="M-month-page">
          <h1 className="M-title">월간 일정</h1>
          <div className="M-calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              views={['month']}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              className="M-calendar"
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MonthPage; 