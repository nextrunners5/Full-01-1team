// ProjectContent.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import "../styles/ProjectPage.css";
import { fetchProjects, deleteProject, Project as ApiProject } from '../services/projectApi';
import { FaProjectDiagram, FaSpinner, FaCheckCircle } from 'react-icons/fa';

// 프로젝트의 상태 타입 정의
type ProjectStatus = "진행 중" | "완료";

interface Project extends ApiProject {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
}

const ProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [filter, setFilter] = useState<"모든 상태" | ProjectStatus>("모든 상태");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data as Project[]);
    } catch (error) {
      console.error('프로젝트 로딩 실패:', error);
    }
  };

  const handleDeleteSelected = () => {
    setIsBulkDelete(true);
    setShowDeletePopup(true);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map(project => project.id));
    }
  };

  const handleSelectProject = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleEditProject = (id: number) => {
    navigate(`/project/edit/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedProject(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (isBulkDelete) {
        await Promise.all(selectedIds.map(id => deleteProject(id.toString())));
        setSelectedIds([]);
      } else if (selectedProject !== null) {
        await deleteProject(selectedProject.toString());
        setSelectedProject(null);
      }
      setShowDeletePopup(false);
      loadProjects();
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
    }
  };

  const getFilteredProjects = () => {
    if (filter === "모든 상태") return projects;
    return projects.filter(project => project.status === filter);
  };

  return (
    <div className="flex-container">
      <Header />
      <Sidebar />
      <div className="project-container">
        <div className="status-cards">
          <div className="status-card">
            <FaProjectDiagram className="status-icon all-projects" />
            <div className="status-info">
              <span className="status-title">전체 프로젝트</span>
              <span className="status-count">{projects.length}</span>
            </div>
          </div>
          <div className="status-card">
            <FaSpinner className="status-icon in-progress-projects" />
            <div className="status-info">
              <span className="status-title">진행중</span>
              <span className="status-count">
                {projects.filter(project => project.status === "진행 중").length}
              </span>
            </div>
          </div>
          <div className="status-card">
            <FaCheckCircle className="status-icon completed-projects" />
            <div className="status-info">
              <span className="status-title">완료</span>
              <span className="status-count">
                {projects.filter(project => project.status === "완료").length}
              </span>
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
          <select className="dropdown" onChange={(e) => setFilter(e.target.value as ProjectStatus)}>
            <option value="모든 상태">모든 상태</option>
            <option value="진행 중">진행 중</option>
            <option value="완료">완료</option>
          </select>
        </div>

        <table className="project-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIds.length === projects.length}
                />
              </th>
              <th>프로젝트명</th>
              <th>상태</th>
              <th>시작일</th>
              <th>마감일</th>
              <th>수정</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredProjects().map((project) => (
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
                  <span className={`status ${project.status === "진행 중" ? "in-progress" : "completed"}`}>
                    {project.status}
                  </span>
                </td>
                <td>{project.startDate}</td>
                <td>{project.endDate}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEditProject(project.id)}
                  >
                    수정하기
                  </button>
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(project.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showDeletePopup && (
          <div className="delete-popup">
            <div className="popup-content">
              <h2>삭제 확인</h2>
              <p>
                {isBulkDelete
                  ? "선택한 프로젝트들을 삭제하시겠습니까?"
                  : "이 프로젝트를 삭제하시겠습니까?"}
              </p>
              <div className="popup-actions">
                <button onClick={() => setShowDeletePopup(false)}>취소</button>
                <button onClick={handleConfirmDelete}>삭제</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProjectPage;
