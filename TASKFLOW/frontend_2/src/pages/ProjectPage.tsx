// ProjectContent.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 이미지는 실제 경로에 맞게 조정해주세요.
import wholeIcon from "../assets/Whole.png";
import ongoingIcon from "../assets/ongoing.png";
import finishedIcon from "../assets/finished.png";
import Header from "../components/common/Header.tsx";
import Sidebar from "../components/common/Sidebar.tsx";
import Footer from "../components/common/Footer.tsx";
import "../styles/ProjectPage.css";


// 프로젝트의 상태 타입 정의 (필요에 따라 확장 가능합니다)
type ProjectStatus = "진행 중" | "완료";

// 필터를 위한 상태 타입 정의
type FilterStatus = "모든 상태" | ProjectStatus;

// 프로젝트 인터페이스 정의
interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
}

const ProjectContent: React.FC = () => {
  const navigate = useNavigate();

  // 필터, 검색어, 프로젝트 목록 상태
  const [filter, setFilter] = useState<FilterStatus>("모든 상태");
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "웹사이트 리뉴얼",
      status: "진행 중",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
    },
    {
      id: 2,
      name: "모바일 앱 개발",
      status: "완료",
      startDate: "2024-02-01",
      endDate: "2024-05-15",
    },
    {
      id: 3,
      name: "데이터 분석 도구 개발",
      status: "진행 중",
      startDate: "2024-03-01",
      endDate: "2024-07-01",
    },
    {
      id: 4,
      name: "IoT 시스템 구축",
      status: "완료",
      startDate: "2024-04-10",
      endDate: "2024-08-20",
    },
    {
      id: 5,
      name: "AI 모델 개발",
      status: "진행 중",
      startDate: "2024-05-15",
      endDate: "2024-09-30",
    },
  ]);

  // 삭제 팝업 관련 상태
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // 필터링된 프로젝트 목록
  const filteredProjects = projects
    .filter((project) => (filter === "모든 상태" ? true : project.status === filter))
    .filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // 새 프로젝트 추가 페이지 이동
  const handleAddProject = () => {
    navigate("/project/create");
  };

  // 프로젝트 수정 페이지 이동
  const handleEditProject = (projectId: number) => {
    navigate(`/project/edit/${projectId}`);
  };

  // 프로젝트 삭제 버튼 클릭
  const handleDeleteClick = (projectId: number) => {
    setSelectedProject(projectId);
    setShowDeletePopup(true);
  };

  // 삭제 확정
  const handleConfirmDelete = () => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== selectedProject)
    );
    setShowDeletePopup(false);
    setSelectedProject(null);
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setSelectedProject(null);
  };

  // 헤더 제목 반환
  const getHeaderTitle = () => {
    if (filter === "진행 중") return "진행중인 프로젝트 목록";
    if (filter === "완료") return "완료된 프로젝트 목록";
    return "전체 프로젝트 목록";
  };

  return (
    <div className="project-container">
      {/* 개요 섹션 */}
      <div className="overview">
        <div className="overview-item">
          <img src={wholeIcon} alt="전체 프로젝트" className="overview-icon" />
          <div className="overview-content">
            <p className="overview-title">전체 프로젝트</p>
            <p className="overview-value">{projects.length}</p>
          </div>
        </div>
        <div className="overview-item">
          <img src={ongoingIcon} alt="진행중" className="overview-icon" />
          <div className="overview-content">
            <p className="overview-title">진행중</p>
            <p className="overview-value">
              {projects.filter((p) => p.status === "진행 중").length}
            </p>
          </div>
        </div>
        <div className="overview-item">
          <img src={finishedIcon} alt="완료" className="overview-icon" />
          <div className="overview-content">
            <p className="overview-title">완료</p>
            <p className="overview-value">
              {projects.filter((p) => p.status === "완료").length}
            </p>
          </div>
        </div>
      </div>

      {/* 헤더 섹션 */}
      <div className="header-container">
        <h2 className="header-title">{getHeaderTitle()}</h2>
        <button className="add-button" onClick={handleAddProject}>
          새 프로젝트 추가
        </button>
      </div>

      {/* 필터 섹션 */}
      <div className="project-header">
        <input
          type="text"
          className="search-input"
          placeholder="프로젝트 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterStatus)}
        >
          <option>모든 상태</option>
          <option>진행 중</option>
          <option>완료</option>
        </select>
      </div>

      {/* 테이블 섹션 */}
      <table className="project-table">
        <thead>
          <tr>
            <th></th>
            <th>프로젝트명</th>
            <th>상태</th>
            <th>시작일</th>
            <th>마감일</th>
            <th>수정</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{project.name}</td>
              <td>
                <span
                  className={`status ${
                    project.status === "진행 중" ? "in-progress" : "completed"
                  }`}
                >
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

      {/* 삭제 확인 팝업 */}
      {showDeletePopup && (
        <div className="delete-popup">
          <div className="popup-content">
            <h3>프로젝트 삭제</h3>
            <p>이 프로젝트를 정말 삭제하시겠습니까?</p>
            <p>이 작업은 되돌릴 수 없습니다.</p>
            <div className="popup-actions">
              <button onClick={handleCancelDelete}>취소</button>
              <button onClick={handleConfirmDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectContent;
