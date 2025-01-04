// ProjectContent.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import '../styles/ProjectPage.css';

interface Project {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
}

const ProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('모든 상태');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(projects.map(project => project.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = () => {
    // 선택된 프로젝트 삭제 로직
    setProjects(prev => prev.filter(project => !selectedIds.includes(project.id)));
    setSelectedIds([]);
  };

  return (
    <div className="flex-container">
      <Sidebar />
      <div className="project-container">
        <Header />
        <div className="status-cards">
          <div className="status-card">
            <span className="status-icon">🔄</span>
            <div className="status-info">
              <span className="status-title">진행 중</span>
              <span className="status-count">5</span>
            </div>
          </div>
          <div className="status-card">
            <span className="status-icon">✅</span>
            <div className="status-info">
              <span className="status-title">완료</span>
              <span className="status-count">3</span>
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
              {projects.map(project => (
                <tr key={project.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(project.id)}
                      onChange={() => {/* 체크박스 핸들러 */}}
                    />
                  </td>
                  <td>{project.name}</td>
                  <td>{project.status}</td>
                  <td>{project.startDate}</td>
                  <td>{project.endDate}</td>
                  <td>
                    <button 
                      className="edit-button"
                      onClick={() => navigate(`/project/edit/${project.id}`)}
                    >
                      수정
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProjectPage;
