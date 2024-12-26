import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header.tsx";
import Sidebar from "../components/common/Sidebar.tsx";
import Footer from "../components/common/Footer.tsx";
import "../styles/ProjectPage.css";

const ProjectPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddProject = () => {
    navigate("/project/create");
  };

  return (
    <div className="layout">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="project-container">
            {/* Overview Section */}
            <div className="overview">
              <div className="overview-item">
                <span className="overview-title">전체 프로젝트</span>
                <span className="overview-value">24</span>
              </div>
              <div className="overview-item">
                <span className="overview-title">진행중</span>
                <span className="overview-value">16</span>
              </div>
              <div className="overview-item">
                <span className="overview-title">완료</span>
                <span className="overview-value">8</span>
              </div>
            </div>

            {/* Header */}
            <div className="header-container">
              <h2 className="header-title">완료된 프로젝트 목록</h2>
              <button className="add-button" onClick={handleAddProject}>
                새 프로젝트 추가
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="project-header">
              <input
                type="text"
                className="search-input"
                placeholder="프로젝트 검색..."
              />
              <select className="dropdown">
                <option>모든 상태</option>
                <option>진행 중</option>
                <option>완료</option>
              </select>
            </div>

            {/* Table */}
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
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>웹사이트 리뉴얼</td>
                  <td>
                    <span className="status in-progress">진행 중</span>
                  </td>
                  <td>2024-01-15</td>
                  <td>2024-03-30</td>
                  <td>
                    <button className="edit-button">수정하기</button>
                  </td>
                  <td>
                    <button className="delete-button">삭제</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>모바일 앱 개발</td>
                  <td>
                    <span className="status completed">완료</span>
                  </td>
                  <td>2024-02-01</td>
                  <td>2024-05-15</td>
                  <td>
                    <button className="edit-button">수정하기</button>
                  </td>
                  <td>
                    <button className="delete-button">삭제</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectPage; 