import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, ToolbarProps as BigCalendarToolbarProps } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Weekly.css'; // CSS 파일 경로 변경
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const localizer = momentLocalizer(moment);

type Event = {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  resource?: { color?: string };
};

// 커스텀 이벤트 컴포넌트의 Props 정의
interface WEventComponentProps {
  event: Event;
  onSelectEvent: (event: Event) => void;
}

// 커스텀 툴바 컴포넌트의 Props 정의
interface CustomToolbarProps extends BigCalendarToolbarProps {}

// 커스텀 이벤트 컴포넌트
const WEventComponent: React.FC<WEventComponentProps> = ({ event, onSelectEvent }) => {
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

// 커스텀 툴바 컴포넌트
const WCustomToolbar: React.FC<CustomToolbarProps> = ({ label, onNavigate, onView }) => {
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

// 이벤트 컴포넌트에 전달되는 추가 Props 정의
interface CustomEventProps {
  event: Event;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource?: any;
}

const WCalendar: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<Event>({ start: new Date(), end: new Date(), title: '' });
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    document.body.classList.add('weekly-page');
    axios
      .get<Event[]>('/api/events')
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });

    return () => {
      document.body.classList.remove('weekly-page');
    };
  }, []);

  const handleAddEvent = (): void => {
    if (newEvent.start && newEvent.end && newEvent.title) {
      axios
        .post<Event>('/api/events', newEvent)
        .then((response) => {
          setEvents([...events, response.data]);
          setShowModal(false);
          setNewEvent({ start: new Date(), end: new Date(), title: '' });
        })
        .catch((error) => {
          console.error('Error adding event:', error);
        });
    }
  };

  const handleDeleteEvent = (): void => {
    if (newEvent.id) {
      axios
        .delete(`/api/events/${newEvent.id}`)
        .then(() => {
          setEvents(events.filter((event) => event.id !== newEvent.id));
          setShowModal(false);
          setNewEvent({ start: new Date(), end: new Date(), title: '' });
        })
        .catch((error) => {
          console.error('Error deleting event:', error);
        });
    }
  };

  const handleSelectEvent = (event: Event): void => {
    setNewEvent(event);
    setShowModal(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }): void => {
    setNewEvent({ start: slotInfo.start, end: slotInfo.end, title: '' });
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <div className="w-main-content">
        <Sidebar />
        <div className="calendar-container"> {/* 클래스 이름 변경 */}
          <div className="title-bar"> {/* 클래스 이름 변경 */}
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
            views={['week']}
            defaultView="week"
            style={{
              height: '70vh',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            components={{
              event: (props: CustomEventProps) => (
                <WEventComponent event={props.event} onSelectEvent={handleSelectEvent} />
              ),
              toolbar: (props: BigCalendarToolbarProps) => (
                <WCustomToolbar {...props} />
              ),
            }}
          />

          {showModal && (
            <div className="modal-overlay"> {/* 클래스 이름 변경 */}
              <div className="modal-content"> {/* 클래스 이름 변경 */}
                <h3>{newEvent.id ? '일정 수정' : '일정 추가'}</h3>
                <div className="modal-row"> {/* 클래스 이름 변경 */}
                  <div>
                    <label>시작 시간</label>
                    <input
                      type="datetime-local"
                      value={newEvent.start ? newEvent.start.toISOString().slice(0, 16) : ''}
                      onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label>종료 시간</label>
                    <input
                      type="datetime-local"
                      value={newEvent.end ? newEvent.end.toISOString().slice(0, 16) : ''}
                      onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label>일정 제목</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    placeholder="일정 제목을 입력하세요"
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div>
                  <label>일정 설명</label>
                  <textarea
                    rows={4}
                    value={newEvent.description || ''}
                    placeholder="일정에 대한 설명을 입력하세요"
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="modal-buttons"> {/* 클래스 이름 변경 */}
                  {newEvent.id && (
                    <button className="modal-delete-btn" onClick={handleDeleteEvent}> {/* 클래스 이름 변경 */}
                      삭제
                    </button>
                  )}
                  <div className="modal-actions"> {/* 클래스 이름 변경 */}
                    <button className="modal-cancel-btn" onClick={() => setShowModal(false)}>
                      취소
                    </button>
                    <button className="modal-save-btn" onClick={handleAddEvent}>
                      저장
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WCalendar;
