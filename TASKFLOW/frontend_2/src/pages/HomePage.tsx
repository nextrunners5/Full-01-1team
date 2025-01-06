import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar,
  dateFnsLocalizer,
  ToolbarProps,
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
import { scheduleApi, Schedule, TodaySchedule, ScheduleData } from '../services/scheduleApi';
import ScheduleModal from '../components/modals/ScheduleModal';
import ScheduleDetailModal from '../components/modals/ScheduleDetailModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { projectApi, Project } from '../services/projectApi';
import ProjectDetailModal from '../components/modals/ProjectDetailModal';
import ProjectModal, { ProjectData } from '../components/modals/ProjectModal';

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

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  isProject?: boolean;
}

interface ProjectStatus extends Project {}

const CustomToolbar: FC<ToolbarProps> = (props) => {
  const goToBack = () => props.onNavigate('PREV');
  const goToNext = () => props.onNavigate('NEXT');

  return (
    <div className="MAI-toolbar-container">
      <div className="MAI-toolbar-center">
        <button className="MAI-navigate-btn" onClick={goToBack}>
          &lt;
        </button>
        <span className="MAI-current-month">{props.label}</span>
        <button className="MAI-navigate-btn" onClick={goToNext}>
          &gt;
        </button>
      </div>
    </div>
  );
};

const HomePage: FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [todayInfo, setTodayInfo] = useState<TodaySchedule | null>(null);
  const [projectList, setProjectList] = useState<ProjectStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [modalMode, setModalMode] = useState<'detail' | 'edit' | 'create'>('create');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProjectCreateModal, setShowProjectCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [projectModalMode, setProjectModalMode] = useState<'detail' | 'edit' | 'create'>('create');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const todaySchedules = await scheduleApi.getTodaySchedules();
        setTodayInfo(todaySchedules);
        const scheduleResponse = await scheduleApi.getSchedules();
        const scheduleEvents = scheduleResponse.map((schedule) => ({
          id: schedule.id,
          title: schedule.title,
          start: new Date(schedule.start_date),
          end: new Date(schedule.end_date),
          isProject: false,
        }));
        const projects = await projectApi.getAllProjects();
        const projectEvents = projects
          .filter((project: Project) => project.status !== 'COMPLETED')
          .map((project: Project) => ({
            id: project.id,
            title: `[Project] ${project.name}`,
            start: new Date(project.startDate),
            end: new Date(project.endDate),
            isProject: true,
          }));
        setEvents([...scheduleEvents, ...projectEvents]);
        setProjectList(projects);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="MAI-app-container">
      <Sidebar />
      <div className="MAI-main-container">
        <Header />
        <main className="MAI-content">
          <section className="MAI-today-date" aria-label="Today's date">
            <h3>오늘</h3>
            <p className="MAI-date">
              {todayInfo?.date} ({todayInfo?.dayOfWeek})
            </p>
          </section>
          <section className="MAI-today" aria-label="Today schedule">
            <div className="MAI-today-header">
              <h3>오늘의 일정</h3>
              <button className="MAI-add-schedule-btn">+</button>
            </div>
            {isLoading ? (
              <div className="MAI-loading">로딩 중...</div>
            ) : (
              <div className="MAI-schedule-list">
                {todayInfo?.schedules.length === 0 ? (
                  <div className="MAI-no-schedule">예정된 일정이 없습니다.</div>
                ) : (
                  <ul>
                    {todayInfo?.schedules.map((schedule) => (
                      <li key={schedule.id}>
                        <span className="MAI-schedule-time">{schedule.time}</span>
                        <span className="MAI-schedule-title">{schedule.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
          <section className="MAI-project-status">
            <div className="MAI-project-header">
              <h3>진행 중인 프로젝트</h3>
              <button className="MAI-add-project-btn">+</button>
            </div>
            <ul>
              {projectList
                .filter((project) => project.status === 'IN_PROGRESS')
                .map((project) => (
                  <li key={project.id} className="MAI-project-item">
                    <div className="MAI-project-info">
                      <div className="MAI-project-details">
                        <span className="MAI-project-title">{project.name}</span>
                        <span className="MAI-project-period">
                          {new Date(project.startDate).toLocaleDateString()} ~
                          {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
          <section className="MAI-calendar">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              className="MAI-calendar-container"
              components={{ toolbar: CustomToolbar }}
            />
          </section>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </div>
  );
};

export default HomePage;
