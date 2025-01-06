// ProjectContent.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProjectModal from '../components/modals/ProjectModal';
import ProjectDetailModal from '../components/modals/ProjectDetailModal';
import { projectApi, Project } from '../services/projectApi';
import { toast, ToastContainer } from 'react-toastify';
import '../styles/ProjectPage.css';
import WholeIcon from '../assets/Whole.png';
import OngoingIcon from '../assets/ongoing.png';
import FinishIcon from '../assets/finished.png';
import { ProjectData } from '../components/modals/ProjectModal';

interface StatusCounts {
  total: number;
  IN_PROGRESS: number;
  COMPLETED: number;
}

const ProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('모든 상태');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail'>('create');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    console.log('현재 프로젝트 목록:', projects);
  }, [projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('프로젝트 목록 요청 시작');
      const data = await projectApi.getAllProjects();
      console.log('받아온 프로젝트 데이터:', data);
      setProjects(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error('프로젝트 목록 조회 오류:', err);
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(projects.map(project => project.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectProject = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(projectId => projectId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await projectApi.deleteMultipleProjects(selectedIds);
      await fetchProjects();
      setSelectedIds([]);
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusCounts = (): StatusCounts => {
    if (!Array.isArray(projects)) {
      return {
        total: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0
      };
    }
    
    const counts: StatusCounts = {
      total: projects.length,
      IN_PROGRESS: 0,
      COMPLETED: 0
    };

    projects.forEach(project => {
      if (project.status === 'IN_PROGRESS') counts.IN_PROGRESS++;
      if (project.status === 'COMPLETED') counts.COMPLETED++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\.$/, '');
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  };

  const getStatusClass = (status?: string) => {
    if (!status) return '';
    return status.toLowerCase();
  };

  const getStatusText = (status?: string) => {
    switch(status) {
      case 'IN_PROGRESS':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      case '진행 중':
        return '진행 중';
      case '완료':
        return '완료';
      default:
        return status || '상태 없음';
    }
  };

  const convertStatus = (status: string) => {
    switch(status) {
      case 'IN_PROGRESS':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      default:
        return status;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (project.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === '모든 상태' || 
                         (filter === '진행 중' && project.status === 'IN_PROGRESS') ||
                         (filter === '완료' && project.status === 'COMPLETED');
    
    return matchesSearch && matchesFilter;
  });

  const handleProjectNameClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setModalMode('detail');
    setShowModal(true);
  };

  const handleEditButtonClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDetailEditClick = () => {
    setModalMode('edit');
  };

  const handleAddClick = () => {
    setSelectedProject(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await projectApi.deleteProject(id);
      setProjects(projects.filter(project => project.id !== id));
      setShowModal(false);
      toast.success('프로젝트가 삭제되었습니다! 🗑️');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const projectToDetailFormat = (project: Project) => ({
    id: project.id,
    title: project.name,
    description: project.description,
    start_date: project.startDate,
    end_date: project.endDate,
    status: project.status
  });

  const handleSaveProject = async (projectData: ProjectData): Promise<void> => {
    try {
      const projectPayload = {
        name: projectData.name,
        description: projectData.description,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        status: projectData.id ? projectData.status : 'IN_PROGRESS'
      };

      if (projectData.id) {
        await projectApi.updateProject(projectData.id, projectPayload);
        const updatedProjects = await projectApi.getAllProjects();
        setProjects(updatedProjects);
        toast.success('프로젝트가 수정되었습니다! 🔄');
      } else {
        const response = await projectApi.createProject(projectPayload);
        const updatedProjects = await projectApi.getAllProjects();
        setProjects(updatedProjects);
        toast.success('새 프로젝트가 생성되었습니다! ✨');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('프로젝트 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleStatusCardClick = (status: '모든 상태' | '진행 중' | '완료') => {
    setFilter(status);
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  // 필터 상태에 따른 헤더 제목을 반환하는 함수
  const getHeaderTitle = (): string => {
    switch (filter) {
      case '진행 중':
        return '진행 중 프로젝트 목록';
      case '완료':
        return '완료 프로젝트 목록';
      default:
        return '전체 프로젝트 목록';
    }
  };

  return (
    <div className="flex-container">
      <Sidebar />
      <div className="project-container">
        <Header />
        <div className="status-cards">
          <div 
            className="status-card"
            onClick={() => handleStatusCardClick('모든 상태')}
          >
            <span className="status-icon">
              <img src={WholeIcon} alt="전체" />
            </span>
            <div className="status-info">
              <span className="status-title">전체 프로젝트</span>
              <span className="status-count">{statusCounts.total || 0}</span>
            </div>
          </div>
          <div 
            className="status-card"
            onClick={() => handleStatusCardClick('진행 중')}
          >
            <span className="status-icon">
              <img src={OngoingIcon} alt="진행중" />
            </span>
            <div className="status-info">
              <span className="status-title">진행 중</span>
              <span className="status-count">{statusCounts.IN_PROGRESS || 0}</span>
            </div>
          </div>
          <div 
            className="status-card"
            onClick={() => handleStatusCardClick('완료')}
          >
            <span className="status-icon">
              <img src={FinishIcon} alt="완료" />
            </span>
            <div className="status-info">
              <span className="status-title">완료</span>
              <span className="status-count">{statusCounts.COMPLETED || 0}</span>
            </div>
          </div>
        </div>

        <div className="header-container">
          {/* 동적 제목 사용 */}
          <h1 className="header-title">{getHeaderTitle()}</h1>
          <div className="buttons-wrapper">
            {selectedIds.length > 0 && (
              <button
                className="delete-selected-button"
                onClick={handleDeleteSelected}
              >
                선택 항목 삭제
              </button>
            )}
            <button
              className="add-button"
              onClick={handleAddClick}
            >
              새 프로젝트 추가
            </button>
          </div>
        </div>

        <div className="search-filter">
          <input
            type="text"
            placeholder="프로젝트 검색..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-select"
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          >
            <option value="모든 상태">모든 상태</option>
            <option value="진행 중">진행 중</option>
            <option value="완료">완료</option>
          </select>
        </div>

        <div className="project-list">
          <table className="project-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === projects.length && projects.length > 0}
                  />
                </th>
                <th>프로젝트명</th>
                <th>상태</th>
                <th>시작일</th>
                <th>마감일</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    {searchTerm ? '검색 결과가 없습니다.' : '프로젝트가 없습니다.'}
                  </td>
                </tr>
              ) : (
                filteredProjects.map(project => (
                  <tr key={project.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(project.id)}
                        onChange={() => handleSelectProject(project.id)}
                      />
                    </td>
                    <td>
                      <span 
                        className="project-name-link"
                        onClick={(e) => handleProjectNameClick(project, e)}
                      >
                        {project.name}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${getStatusClass(project.status)}`}>
                        {convertStatus(project.status)}
                      </span>
                    </td>
                    <td>{formatDate(project.startDate)}</td>
                    <td>{formatDate(project.endDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
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
      {showModal && (
        modalMode === 'detail' && selectedProject ? (
          <ProjectDetailModal
            project={projectToDetailFormat(selectedProject)}
            onClose={handleCloseModal}
            onEdit={handleDetailEditClick}
            onDelete={() => handleDeleteProject(selectedProject.id)}
          />
        ) : (
          <ProjectModal
            onClose={handleCloseModal}
            onSave={handleSaveProject}
            initialData={modalMode === 'edit' && selectedProject ? {
              id: selectedProject.id,
              name: selectedProject.name,
              description: selectedProject.description,
              startDate: selectedProject.startDate,
              endDate: selectedProject.endDate,
              status: selectedProject.status
            } : null}
            isOpen={showModal}
          />
        )
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
  );
};

export default ProjectPage;
