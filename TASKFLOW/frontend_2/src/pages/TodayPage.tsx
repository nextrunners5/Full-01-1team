import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import scheduleApi, { Schedule, ScheduleResponse } from '../services/scheduleApi';
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import '../styles/TodayPage.css';

interface Event {
  id: number;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

const TodayPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const today = new Date();
      const formattedDate = format(today, 'yyyy-MM-dd');
      
      const response = await scheduleApi.getDailySchedules(formattedDate);
      
      const schedules = response.map((schedule: ScheduleResponse) => ({
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        start: new Date(schedule.start_date),
        end: new Date(schedule.end_date)
      }));

      setEvents(schedules);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCreateEvent = async (formData: any) => {
    try {
      const newEvent = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date
      };

      const response = await scheduleApi.createSchedule(newEvent);
      
      const createdEvent = {
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

  // ... 나머지 코드는 동일하게 유지

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <div className="content">
          {/* 컴포넌트 내용 */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TodayPage; 