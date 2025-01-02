import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, ToolbarProps as BigCalendarToolbarProps } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Weekly.css';
import { scheduleApi, Schedule } from '../services/scheduleApi';

const localizer = momentLocalizer(moment);

type Event = {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  resource?: { color?: string };
};

type EventComponentProps = {
  event: Event;
  onSelectEvent: (event: Event) => void;
};

const WEventComponent: React.FC<EventComponentProps> = ({ event, onSelectEvent }) => {
  return (
    <div
      style={{
        backgroundColor: event.resource?.color || '#2563eb',
        borderRadius: '4px',
        padding: '5px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        cursor: 'pointer',
      }}
      onClick={() => onSelectEvent(event)}
    >
      {event.title}
    </div>
  );
};

const WCustomToolbar: React.FC<BigCalendarToolbarProps> = ({ label, onNavigate }) => {
  const goToBack = () => onNavigate('PREV');
  const goToNext = () => onNavigate('NEXT');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#fff',
        color: '#2563eb',
        position: 'relative',
      }}
    >
      <button
        onClick={goToBack}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#2563eb',
          fontSize: '18px',
          cursor: 'pointer',
          marginRight: '8px',
        }}
      >
        &lt;
      </button>
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{label}</span>
      <button
        onClick={goToNext}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#2563eb',
          fontSize: '18px',
          cursor: 'pointer',
          marginLeft: '8px',
        }}
      >
        &gt;
      </button>
    </div>
  );
};

const WeeklyPage: React.FC = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [eventDescription, setEventDescription] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [events, setEvents] = useState<Schedule[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);

  useEffect(() => {
    document.body.classList.add('weekly-page');
    loadSchedules();

    return () => {
      document.body.classList.remove('weekly-page');
    };
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await scheduleApi.getAllSchedules();
      setEvents(response.data);
    } catch (error) {
      console.error('일정 로딩 실패:', error);
    }
  };

  const handleAddEvent = async () => {
    try {
      const newEvent: Schedule = {
        title: eventTitle,
        start: startDate,
        end: endDate,
        description: eventDescription
      };

      await scheduleApi.createSchedule(newEvent);
      await loadSchedules();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('일정 추가 실패:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent?.id) {
      try {
        await scheduleApi.deleteSchedule(selectedEvent.id);
        await loadSchedules();
        setShowModal(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error('일정 삭제 실패:', error);
      }
    }
  };

  const resetForm = () => {
    setEventTitle("");
    setEventDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event: Schedule) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setStartDate(new Date(event.start));
    setEndDate(new Date(event.end));
    setEventDescription(event.description || '');
    setShowModal(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    resetForm();
    setStartDate(slotInfo.start);
    setEndDate(slotInfo.end);
    setShowModal(true);
  };

  return (
    <div className="calendar-container">
      <div className="title-bar">
        <h2>Weekly Timeline</h2>
        <button onClick={() => setShowModal(true)}>+ New Schedule</button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        views={{ week: true }}
        defaultView="week"
        style={{
          height: '70vh',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        components={{
          event: (props: any) => <WEventComponent {...props} onSelectEvent={handleSelectEvent} />,
          toolbar: (props: any) => <WCustomToolbar {...props} />,
        }}
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedEvent?.id ? '일정 수정' : '일정 추가'}</h3>
            <div className="modal-row">
              <div>
                <label>시작 시간</label>
                <input
                  type="datetime-local"
                  value={startDate.toISOString().slice(0, 16)}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />
              </div>
              <div>
                <label>종료 시간</label>
                <input
                  type="datetime-local"
                  value={endDate.toISOString().slice(0, 16)}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label>일정 제목</label>
              <input
                type="text"
                value={eventTitle}
                placeholder="일정 제목을 입력하세요"
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            <div>
              <label>일정 설명</label>
              <textarea
                rows={4}
                value={eventDescription}
                placeholder="일정에 대한 설명을 입력하세요"
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>
            <div className="modal-buttons">
              {selectedEvent?.id && (
                <button className="modal-delete-btn" onClick={handleDeleteEvent}>
                  삭제
                </button>
              )}
              <button className="modal-save-btn" onClick={handleAddEvent}>
                {selectedEvent?.id ? '수정' : '추가'}
              </button>
              <button className="modal-cancel-btn" onClick={() => {
                setShowModal(false);
                resetForm();
              }}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPage; 