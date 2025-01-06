import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, ToolbarProps } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { scheduleApi, Schedule } from '../services/scheduleApi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Monthly.css';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import ScheduleModal, { ScheduleData } from '../components/modals/ScheduleModal';
import ScheduleDetailModal from '../components/modals/ScheduleDetailModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  id: number;
  title: string;
  start: Date;
  end: Date;
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
  const [newEvent, setNewEvent] = useState<Event | null>(null);
  const [modalMode, setModalMode] = useState<'detail' | 'edit' | 'create'>('create');

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

  const saveEvent = async (eventData: any) => {
    try {
      const scheduleData = {
        title: eventData.title,
        description: eventData.description,
        start_date: eventData.start.toISOString(),
        end_date: eventData.end.toISOString()
      };

      if (eventData.id) {
        const response = await scheduleApi.updateSchedule(eventData.id, scheduleData);
        return {
          id: response.id,
          title: response.title,
          start: new Date(response.start_date),
          end: new Date(response.end_date),
          description: response.description
        };
      } else {
        const response = await scheduleApi.createSchedule(scheduleData);
        return {
          id: response.id,
          title: response.title,
          start: new Date(response.start_date),
          end: new Date(response.end_date),
          description: response.description
        };
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      return null;
    }
  };

  const deleteEventFromServer = async (id: number) => {
    try {
      await scheduleApi.deleteSchedule(id);
      return true;
    } catch (error) {
      console.error('Failed to delete event:', error);
      return false;
    }
  };

  useEffect(() => {
    document.body.classList.add('monthly-page');
    fetchEvents();
    return () => {
      document.body.classList.remove('monthly-page');
    };
  }, []);

  const handleSaveEvent = async (scheduleData: ScheduleData): Promise<void> => {
    try {
      if (!scheduleData.start || !scheduleData.end) {
        throw new Error('시작 시간과 종료 시간을 입력해주세요');
      }

      if (scheduleData.id) {
        try {
          const response = await scheduleApi.updateSchedule(scheduleData.id, {
            title: scheduleData.title,
            description: scheduleData.description,
            start_date: scheduleData.start.toISOString(),
            end_date: scheduleData.end.toISOString()
          });

          const updatedEvent: Event = {
            id: response.id,
            title: response.title,
            start: new Date(response.start_date),
            end: new Date(response.end_date),
            description: response.description || ''
          };

          setEvents(events.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
          ));
          toast.success('일정이 성공적으로 수정되었습니다! 🔄');
        } catch (error) {
          toast.error('일정 수정에 실패했습니다. 다시 시도해주세요.');
          throw new Error('일정 수정 실패');
        }
      } else {
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
        } catch (error) {
          toast.error('일정 생성에 실패했습니다. 다시 시도해주세요.');
          throw new Error('일정 생성 실패');
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving event:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('일정 저장에 실패했습니다.');
      }
      throw error;
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await scheduleApi.deleteSchedule(id);
      setEvents(events.filter(event => event.id !== id));
      handleCloseModal();
      toast.success('일정이 삭제되었습니다! 🗑️');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('일정 삭제에 실패했습니다. 다시 시도해주세요.');
      throw new Error('일정 삭제 실패');
    }
  };

  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    const selectedDate = new Date(slotInfo.start);
    selectedDate.setHours(0, 0, 0, 0);

    setNewEvent({
      id: -1,
      title: '',
      start: selectedDate,
      end: selectedDate,
      description: '',
    });
    setShowModal(true);
  };

  const handleScheduleClick = (schedule: Event) => {
    setNewEvent(schedule);
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

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent(null);
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
            onSelectEvent={handleScheduleClick}
            defaultView="month"
            views={{ month: true }}
            className="M-calendar"
            components={{
              toolbar: (props: ToolbarProps) => <CustomToolbar {...props} onAddEvent={handleAddClick} />,
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
          modalMode === 'detail' && newEvent ? (
            <ScheduleDetailModal
              schedule={newEvent}
              onClose={handleCloseModal}
              onEdit={handleEditClick}
              onDelete={() => handleDeleteEvent(newEvent.id)}
            />
          ) : (
            <ScheduleModal
              onClose={handleCloseModal}
              onSave={handleSaveEvent}
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
        <Footer />
      </div>
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
  );
};

export default MonthPageM;
