import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, ToolbarProps } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Monthly.css'; // CSS 파일명 변경
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const locales = {
  "en-US": require("date-fns/locale/en-US"),
  "ko": require("date-fns/locale/ko"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  id: number | null;
  title: string;
  start: string | Date;
  end: string | Date;
  description: string;
}

interface CustomToolbarProps extends ToolbarProps {
  onAddEvent: () => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ onNavigate, label, onAddEvent }) => (
  <div className="M-toolbar-container">
    <button className="M-navigate-btn" onClick={() => onNavigate('PREV')}>&lt;</button>
    <span className="M-current-month">{label}</span>
    <button className="M-navigate-btn" onClick={() => onNavigate('NEXT')}>&gt;</button>
    <button className="M-add-event-btn" onClick={onAddEvent}>+</button>
  </div>
);

const MonthPageM: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    id: null,
    title: '',
    start: '',
    end: '',
    description: '',
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const saveEvent = async (event: Omit<Event, 'id'> & { id?: number | null }) => {
    try {
      const response = event.id
        ? await axios.put(`/api/events/${event.id}`, event)
        : await axios.post('/api/events', event);
      return response.data;
    } catch (error) {
      console.error('Failed to save event:', error);
      return null;
    }
  };

  const deleteEventFromServer = async (id: number | null) => {
    try {
      if (id) await axios.delete(`/api/events/${id}`);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  useEffect(() => {
    document.body.classList.add('monthly-page');
    fetchEvents();
    return () => {
      document.body.classList.remove('monthly-page');
    };
  }, []);

  const handleAddEvent = async () => {
    const savedEvent = await saveEvent(newEvent);
    if (savedEvent) {
      setEvents((prev) => {
        const updatedEvents = newEvent.id
          ? prev.map((e) => (e.id === newEvent.id ? savedEvent : e))
          : [...prev, savedEvent];
        return updatedEvents;
      });
    }
    setShowModal(false);
  };

  const handleDeleteEvent = async () => {
    if (newEvent.id) {
      await deleteEventFromServer(newEvent.id);
      setEvents((prev) => prev.filter((event) => event.id !== newEvent.id));
      setShowModal(false);
    }
  };

  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    setNewEvent({
      id: null,
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      description: '',
    });
    setShowModal(true);
  };

  const handleEventSelect = (event: Event) => {
    setNewEvent(event);
    setShowModal(true);
  };

  return (
    <div className="M-month-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="M-calendar-container">
          <h2 className="M-title">MONTHLY</h2>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSlotSelect}
            onSelectEvent={handleEventSelect}
            defaultView="month"
            views={{ month: true }}
            className="M-calendar"
            components={{
              toolbar: (props: ToolbarProps) => <CustomToolbar {...props} onAddEvent={() => setShowModal(true)} />,
            }}
            messages={{
              next: "다음",
              previous: "이전",
              today: "오늘",
              month: "월",
              noEventsInRange: "일정이 없습니다."
            }}
          />
        </div>
        {showModal && (
          <div className="M-modal-overlay">
            <div className="M-modal-content">
              <h3>{newEvent.id ? '일정 수정' : '일정 추가'}</h3>
              <div className="M-modal-row">
                <div>
                  <label>시작 시간</label>
                  <input
                    type="datetime-local"
                    value={newEvent.start ? new Date(newEvent.start).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                  />
                </div>
                <div>
                  <label>종료 시간</label>
                  <input
                    type="datetime-local"
                    value={newEvent.end ? new Date(newEvent.end).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label>일정 제목</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div>
                <label>일정 설명</label>
                <textarea
                  rows={4}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                ></textarea>
              </div>
              <div className="M-modal-buttons">
                {newEvent.id && (
                  <button className="M-modal-delete-btn" onClick={handleDeleteEvent}>
                    삭제
                  </button>
                )}
                <div className="M-modal-actions">
                  <button className="M-modal-cancel-btn" onClick={() => setShowModal(false)}>
                    취소
                  </button>
                  <button className="M-modal-save-btn" onClick={handleAddEvent}>
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default MonthPageM;
