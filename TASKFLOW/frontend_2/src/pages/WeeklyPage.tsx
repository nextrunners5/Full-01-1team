import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, ToolbarProps as BigCalendarToolbarProps } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Weekly.css'; // CSS 파일 경로 변경
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { scheduleApi, Schedule } from '../services/scheduleApi';
import ScheduleModal, { ScheduleData } from '../components/modals/ScheduleModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScheduleDetailModal from '../components/modals/ScheduleDetailModal';

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  resource?: { color?: string };
}

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
  const [newEvent, setNewEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [modalMode, setModalMode] = useState<'detail' | 'edit' | 'create'>('create');

  useEffect(() => {
    document.body.classList.add('weekly-page');
    fetchEvents();

    return () => {
      document.body.classList.remove('weekly-page');
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await scheduleApi.getSchedules();
      const events = response.map((schedule: Schedule) => ({
        id: schedule.id,
        title: schedule.title,
        start: new Date(schedule.start_date),
        end: new Date(schedule.end_date),
        description: schedule.description
      }));
      setEvents(events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleAddEvent = async (scheduleData: ScheduleData): Promise<void> => {
    try {
      if (!scheduleData.start || !scheduleData.end) {
        throw new Error('시작 시간과 종료 시간을 입력해주세요');
      }

      try {
        const response = await scheduleApi.createSchedule({
          title: scheduleData.title,
          description: scheduleData.description,
          start_date: scheduleData.start.toISOString(),
          end_date: scheduleData.end.toISOString()
        });

        const createdEvent: Event = {
          id: response.id,
          title: response.title,
          start: new Date(response.start_date),
          end: new Date(response.end_date),
          description: response.description || ''
        };
        
        setEvents([...events, createdEvent]);
        toast.success('새로운 일정이 추가되었습니다! ✨');
        setShowModal(false);
      } catch (error) {
        toast.error('일정 생성에 실패했습니다. 다시 시도해주세요.');
        throw new Error('일정 생성 실패');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('일정 저장에 실패했습니다.');
      }
      throw error;
    }
  };

  const handleDeleteEvent = async (id: number): Promise<void> => {
    try {
      await scheduleApi.deleteSchedule(id);
      setEvents(events.filter((event) => event.id !== id));
      setShowModal(false);
      toast.success('일정이 삭제되었습니다! 🗑️');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('일정 삭제에 실패했습니다. 다시 시도해주세요.');
      throw new Error('일정 삭제 실패');
    }
  };

  const handleScheduleClick = (event: Event) => {
    setNewEvent(event);
    setModalMode('detail');
    setShowModal(true);
  };

  const handleEditClick = () => {
    setModalMode('edit');
  };

  const handleAddClick = () => {
    setNewEvent(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }): void => {
    setNewEvent({
      id: -1,
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      description: ''
    });
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
            <button onClick={handleAddClick}>+ New Schedule</button>
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
                <WEventComponent event={props.event} onSelectEvent={handleScheduleClick} />
              ),
              toolbar: (props: BigCalendarToolbarProps) => (
                <WCustomToolbar {...props} />
              ),
            }}
            onSelectEvent={handleScheduleClick}
          />

          {showModal && (
            modalMode === 'detail' && newEvent ? (
              <ScheduleDetailModal
                schedule={newEvent}
                onClose={() => setShowModal(false)}
                onEdit={handleEditClick}
                onDelete={() => handleDeleteEvent(newEvent.id)}
              />
            ) : (
              <ScheduleModal
                onClose={() => setShowModal(false)}
                onSave={handleAddEvent}
                initialData={modalMode === 'edit' && newEvent ? {
                  id: newEvent.id,
                  title: newEvent.title,
                  description: newEvent.description,
                  start: newEvent.start,
                  end: newEvent.end
                } : null}
                isOpen={showModal}
              />
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WCalendar;
