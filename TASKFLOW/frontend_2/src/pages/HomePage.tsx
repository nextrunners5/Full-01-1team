import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar,
  dateFnsLocalizer,
  ToolbarProps,
  View, // 문자열로 뷰 지정 시 필요할 수 있음
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

// 달력 초기화
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// 달력 이벤트 타입
interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  isProject?: boolean;  // 프로젝트와 일정을 구분하기 위한 플래그
}

// 프로젝트 상태 타입
interface ProjectStatus extends Project {}

// 커스텀 툴바(옵션)
const CustomToolbar: FC<ToolbarProps> = (props) => {
  const goToBack = () => props.onNavigate('PREV');
  const goToNext = () => props.onNavigate('NEXT');

  return (
    <div className="toolbar-container">
      <div className="toolbar-center">
        <button className="navigate-btn" onClick={goToBack}>
          &lt;
        </button>
        <span className="current-month">{props.label}</span>
        <button className="navigate-btn" onClick={goToNext}>
          &gt;
        </button>
      </div>
    </div>
  );
};

const HomePage: FC = () => {
  const navigate = useNavigate();

  // ---------------------
  // 1) State 정의
  // ---------------------
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

  // 날짜/요일 표시에 사용할 값
  const currentDate = new Date();
  const dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' });

  // ---------------------
  // 2) useEffect를 통한 백엔드 연동
  // ---------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 오늘의 일정 가져오기
        const todaySchedules = await scheduleApi.getTodaySchedules();
        setTodayInfo(todaySchedules);

        // 달력 이벤트 가져오기 (일정)
        const scheduleResponse = await scheduleApi.getSchedules();
        const scheduleEvents = scheduleResponse.map(schedule => ({
          id: schedule.id,
          title: schedule.title,
          start: new Date(schedule.start_date),
          end: new Date(schedule.end_date),
          isProject: false
        }));

        // 프로젝트 가져오기 (완료되지 않은 프로젝트만)
        const projects = await projectApi.getAllProjects();
        const projectEvents = projects
          .filter((project: Project) => project.status !== 'COMPLETED')
          .map((project: Project) => ({
            id: project.id,
            title: `[Project] ${project.name}`,
            start: new Date(project.startDate),
            end: new Date(project.endDate),
            isProject: true
          }));

        // 일정과 프로젝트 합치기
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

  const handleAddClick = () => {
    setSelectedSchedule(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleCalendarEventClick = (event: CalendarEvent) => {
    if (event.isProject) {
      // 프로젝트인 경우
      const project = projectList.find(p => p.id === event.id);
      if (project) {
        setSelectedProject(project);
        setProjectModalMode('detail');
        setShowProjectModal(true);
      }
    } else {
      // 일정인 경우
      const scheduleDetail: Schedule = {
        id: event.id,
        title: event.title,
        description: '',
        start_date: event.start.toISOString(),
        end_date: event.end.toISOString()
      };
      setSelectedSchedule(scheduleDetail);
      setModalMode('detail');
      setShowModal(true);
    }
  };

  const handleTodayScheduleClick = (schedule: TodaySchedule['schedules'][0]) => {
    const scheduleDetail: Schedule = {
      id: schedule.id,
      title: schedule.title,
      description: '',
      start_date: schedule.start_date,
      end_date: schedule.end_date
    };
    setSelectedSchedule(scheduleDetail);
    setModalMode('detail');
    setShowModal(true);
  };

  const handleEditClick = () => {
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSchedule(null);
  };

  const handleSaveSchedule = async (scheduleData: ScheduleData): Promise<void> => {
    try {
      if (!scheduleData.start || !scheduleData.end) {
        throw new Error('시작 시간과 종료 시간을 입력해주세요');
      }

      const payload = {
        title: scheduleData.title,
        description: scheduleData.description,
        start_date: scheduleData.start.toISOString(),
        end_date: scheduleData.end.toISOString()
      };

      if (scheduleData.id) {
        await scheduleApi.updateSchedule(scheduleData.id, payload);
        toast.success('일정이 수정되었습니다! 🔄');
      } else {
        await scheduleApi.createSchedule(payload);
        toast.success('새로운 일정이 추가되었습니다! ✨');
      }

      // 일정 목록 새로고침
      const [todaySchedules, allSchedules] = await Promise.all([
        scheduleApi.getTodaySchedules(),
        scheduleApi.getSchedules()
      ]);

      setTodayInfo(todaySchedules);
      setEvents(allSchedules.map(schedule => ({
        id: schedule.id,
        title: schedule.title,
        start: new Date(schedule.start_date),
        end: new Date(schedule.end_date)
      })));

      handleCloseModal();
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('일정 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      await scheduleApi.deleteSchedule(scheduleId);
      
      // 일정 목록 새로고침
      const [todaySchedules, allSchedules] = await Promise.all([
        scheduleApi.getTodaySchedules(),
        scheduleApi.getSchedules()
      ]);

      setTodayInfo(todaySchedules);
      setEvents(allSchedules.map(schedule => ({
        id: schedule.id,
        title: schedule.title,
        start: new Date(schedule.start_date),
        end: new Date(schedule.end_date)
      })));

      setShowModal(false);
      toast.success('일정이 삭제되었습니다! 🗑️');
    } catch (error) {
      console.error('일정 삭제 중 오류 발생:', error);
      toast.error('일정 삭제에 실패했습니다.');
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await projectApi.deleteProject(id);
      
      // 프로젝트 목록 새로고침
      const updatedProjects = await projectApi.getAllProjects();
      setProjectList(updatedProjects);
      
      setShowProjectModal(false);
      toast.success('프로젝트가 삭제되었습니다! 🗑️');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleAddProject = async (projectData: ProjectData): Promise<void> => {
    try {
      const projectPayload = {
        name: projectData.name,
        description: projectData.description,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        status: 'IN_PROGRESS'  // 새 프로젝트는 항상 진행 중
      };

      await projectApi.createProject(projectPayload);
      
      // 프로젝트 목록과 달력 이벤트 업데이트
      const [schedules, projects] = await Promise.all([
        scheduleApi.getSchedules(),
        projectApi.getAllProjects()
      ]);

      const scheduleEvents = schedules.map(schedule => ({
        id: schedule.id,
        title: schedule.title,
        start: new Date(schedule.start_date),
        end: new Date(schedule.end_date),
        isProject: false
      }));

      const projectEvents = projects
        .filter((project: Project) => project.status !== 'COMPLETED')
        .map((project: Project) => ({
          id: project.id,
          title: `[Project] ${project.name}`,
          start: new Date(project.startDate),
          end: new Date(project.endDate),
          isProject: true
        }));

      setEvents([...scheduleEvents, ...projectEvents]);
      setProjectList(projects);
      
      setShowProjectCreateModal(false);
      toast.success('새 프로젝트가 생성되었습니다! ✨');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('프로젝트 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleUpdateProject = async (projectData: ProjectData): Promise<void> => {
    try {
      const projectPayload = {
        name: projectData.name,
        description: projectData.description,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        status: projectData.status
      };

      if (selectedProject?.id) {
        await projectApi.updateProject(selectedProject.id, projectPayload);
        
        // 프로젝트 목록과 달력 이벤트 업데이트
        const [schedules, projects] = await Promise.all([
          scheduleApi.getSchedules(),
          projectApi.getAllProjects()
        ]);

        const scheduleEvents = schedules.map(schedule => ({
          id: schedule.id,
          title: schedule.title,
          start: new Date(schedule.start_date),
          end: new Date(schedule.end_date),
          isProject: false
        }));

        const projectEvents = projects
          .filter((project: Project) => project.status !== 'COMPLETED')
          .map((project: Project) => ({
            id: project.id,
            title: `[Project] ${project.name}`,
            start: new Date(project.startDate),
            end: new Date(project.endDate),
            isProject: true
          }));

        setEvents([...scheduleEvents, ...projectEvents]);
        setProjectList(projects);
        
        setShowProjectModal(false);
        setProjectModalMode('detail');
        toast.success('프로젝트가 수정되었습니다! 🔄');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('프로젝트 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteClick = (id: number) => {
    setProjectToDelete(id);
    setShowDeleteModal(true);
    setShowProjectModal(false); // 상세 모달 닫기
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await projectApi.deleteProject(projectToDelete);
        
        // 프로젝트 목록 새로고침
        const updatedProjects = await projectApi.getAllProjects();
        setProjectList(updatedProjects);
        
        // 달력 이벤트 업데이트 (완료되지 않은 프로젝트만)
        const [schedules, projects] = await Promise.all([
          scheduleApi.getSchedules(),
          projectApi.getAllProjects()
        ]);

        const scheduleEvents = schedules.map(schedule => ({
          id: schedule.id,
          title: schedule.title,
          start: new Date(schedule.start_date),
          end: new Date(schedule.end_date),
          isProject: false
        }));

        const projectEvents = projects
          .filter((project: Project) => project.status !== 'COMPLETED')
          .map((project: Project) => ({
            id: project.id,
            title: `[Project] ${project.name}`,
            start: new Date(project.startDate),
            end: new Date(project.endDate),
            isProject: true
          }));

        setEvents([...scheduleEvents, ...projectEvents]);
        
        setShowDeleteModal(false);
        toast.success('프로젝트가 삭제되었습니다! 🗑️');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleProjectEditClick = () => {
    setProjectModalMode('edit');
  };

  // ---------------------
  // 3) 렌더링
  // ---------------------
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <main className="content">
          {/* TODAY'S DATE */}
          <section className="today-date" aria-label="Today's date">
            <h3>오늘</h3>
            <p className="date">
              {todayInfo?.date} ({todayInfo?.dayOfWeek})
            </p>
          </section>

          {/* TODAY'S SCHEDULE */}
          <section className="today" aria-label="Today schedule">
            <div className="today-header">
              <h3>오늘의 일정</h3>
              <button className="add-schedule-btn" onClick={handleAddClick}>
                +
              </button>
            </div>
            {isLoading ? (
              <div className="loading">로딩 중...</div>
            ) : (
              <div className="schedule-list">
                {todayInfo?.schedules.length === 0 ? (
                  <div className="no-schedule">예정된 일정이 없습니다.</div>
                ) : (
                  <ul>
                    {todayInfo?.schedules.map((schedule) => (
                      <li 
                        key={`${schedule.time}-${schedule.title}`}
                        onClick={() => handleTodayScheduleClick(schedule)}
                      >
                        <span className="schedule-time">{schedule.time}</span>
                        <span className="schedule-title">{schedule.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>

          {/* PROJECT STATUS */}
          <section className="project-status" aria-label="Project status">
            <div className="project-header">
              <h3>진행 중인 프로젝트</h3>
              <button className="add-project-btn" onClick={() => setShowProjectCreateModal(true)}>
                +
              </button>
            </div>
            <ul>
              {projectList
                .filter(project => project.status === 'IN_PROGRESS')
                .map((project) => (
                  <li 
                    key={project.id} 
                    className="project-item"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="project-info">
                      <div className="project-details">
                        <span className="project-title">{project.name}</span>
                        <span className="project-period">
                          {new Date(project.startDate).toLocaleDateString('ko-KR')} ~ 
                          {new Date(project.endDate).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </section>

          {/* CALENDAR */}
          <section className="calendar" aria-label="Calendar">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              views={['month']}
              className="calendar-container"
              components={{ toolbar: CustomToolbar }}
              onSelectEvent={handleCalendarEventClick}
              eventPropGetter={(event: CalendarEvent) => ({
                style: {
                  backgroundColor: event.isProject ? '#1100FF' : '#2563eb',
                  borderRadius: '4px',
                  opacity: 0.8,
                  color: 'white',
                  border: '0px',
                  display: 'block'
                }
              })}
              messages={{
                next: "다음",
                previous: "이전",
                today: "오늘",
                month: "월",
                noEventsInRange: "일정이 없습니다."
              }}
            />
          </section>
        </main>
        <Footer />

        {/* 모달 */}
        {showModal && (
          modalMode === 'detail' && selectedSchedule ? (
            <ScheduleDetailModal
              schedule={{
                id: selectedSchedule.id,
                title: selectedSchedule.title,
                description: selectedSchedule.description || '',
                start: new Date(selectedSchedule.start_date),
                end: new Date(selectedSchedule.end_date)
              }}
              onClose={handleCloseModal}
              onEdit={handleEditClick}
              onDelete={() => {
                if (selectedSchedule?.id) {
                  handleDeleteSchedule(selectedSchedule.id);
                }
              }}
            />
          ) : (
            <ScheduleModal
              onClose={handleCloseModal}
              onSave={handleSaveSchedule}
              initialData={modalMode === 'edit' && selectedSchedule ? {
                id: selectedSchedule.id,
                title: selectedSchedule.title,
                description: selectedSchedule.description,
                start: selectedSchedule.start_date ? new Date(selectedSchedule.start_date) : new Date(),
                end: selectedSchedule.end_date ? new Date(selectedSchedule.end_date) : new Date()
              } : null}
              isOpen={showModal}
            />
          )
        )}

        {showProjectModal && selectedProject && (
          projectModalMode === 'detail' ? (
            <ProjectDetailModal
              project={{
                id: selectedProject.id,
                title: selectedProject.name,
                description: selectedProject.description,
                start_date: selectedProject.startDate,
                end_date: selectedProject.endDate,
                status: selectedProject.status === 'IN_PROGRESS' ? '진행 중' : selectedProject.status,
                members: []
              }}
              onClose={() => setShowProjectModal(false)}
              onEdit={handleProjectEditClick}
              onDelete={() => handleDeleteClick(selectedProject.id)}
            />
          ) : (
            <ProjectModal
              onClose={() => {
                setShowProjectModal(false);
                setProjectModalMode('detail');
              }}
              onSave={handleUpdateProject}
              initialData={{
                id: selectedProject.id,
                name: selectedProject.name,
                description: selectedProject.description,
                startDate: selectedProject.startDate,
                endDate: selectedProject.endDate,
                status: selectedProject.status
              }}
              isOpen={showProjectModal}
            />
          )
        )}

        {showProjectCreateModal && (
          <ProjectModal
            onClose={() => setShowProjectCreateModal(false)}
            onSave={handleAddProject}
            initialData={null}
            isOpen={showProjectCreateModal}
          />
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>프로젝트 삭제</h3>
              <p>선택한 프로젝트를 삭제하시겠습니까?</p>
              <div className="modal-buttons">
                <button onClick={() => setShowDeleteModal(false)} className="cancel-button">
                  취소
                </button>
                <button onClick={confirmDelete} className="confirm-button">
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
};

export default HomePage;
