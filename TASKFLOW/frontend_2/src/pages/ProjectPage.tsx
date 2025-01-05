// ProjectContent.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { projectApi, Project } from '../services/projectApi';
import '../styles/ProjectPage.css';

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
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    return status === 'IN_PROGRESS' ? '진행 중' : '완료';
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === '모든 상태' || 
                         (filter === '진행 중' && project.status === 'IN_PROGRESS') ||
                         (filter === '완료' && project.status === 'COMPLETED');
    
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="flex-container">
      <Sidebar />
      <div className="project-container">
        <Header />
        <div className="status-cards">
          <div className="status-card">
            <span className="status-icon">📋</span>
            <div className="status-info">
              <span className="status-title">전체 프로젝트</span>
              <span className="status-count">{statusCounts.total || 0}</span>
            </div>
          </div>
          <div className="status-card">
            <span className="status-icon">🔄</span>
            <div className="status-info">
              <span className="status-title">진행 중</span>
              <span className="status-count">{statusCounts.IN_PROGRESS || 0}</span>
            </div>
          </div>
          <div className="status-card">
            <span className="status-icon">✅</span>
            <div className="status-info">
              <span className="status-title">완료</span>
              <span className="status-count">{statusCounts.COMPLETED || 0}</span>
            </div>
          </div>
        </div>

        <div className="header-container">
          <h1 className="header-title">전체 프로젝트 목록</h1>
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
              onClick={() => navigate("/project/create")}
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
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
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
                    <td>{project.name}</td>
                    <td>
                      <span className={`status ${project.status.toLowerCase()}`}>
                        {getStatusText(project.status)}
                      </span>
                    </td>
                    <td>{formatDate(project.startDate)}</td>
                    <td>{formatDate(project.endDate)}</td>
                    <td>
                      <button 
                        className="edit-button"
                        onClick={() => navigate(`/project/edit/${project.id}`)}
                      >
                        수정
                      </button>
                    </td>
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
    </div>
  );
};

export default ProjectPage;
