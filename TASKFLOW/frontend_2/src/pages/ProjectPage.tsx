import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectPage: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const handleAddProject = () => {
    navigate("/project/create"); // 새 프로젝트 추가 페이지로 이동
  };

  return (
    <div className="project-container">
      <style>
        {`
          .project-container {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            background-color: #F4F5FC;
            padding: 16px;
          }

          .overview {
            display: flex;
          }

          .overview-item {
            text-align: center;
            background: #ffffff;
            padding: 20px 16px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            flex: 1;
            margin: 0 8px;
          }

          .overview-title {
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
          }

          .overview-value {
            font-size: 28px;
            color: #333;
            font-weight: bold;
          }

          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .header-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }

          .add-button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }

          .add-button:hover {
            background-color: #0056b3;
          }

          .project-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            gap: 12px;
          }

          .search-input {
            flex-grow: 1;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .dropdown {
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #ffffff;
            font-size: 14px;
          }

          .project-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
          }

          .project-table th {
            background-color: #F4F4F4;
            text-align: center;
            font-size: 14px;
            padding: 12px;
            font-weight: bold;
            border-bottom: 2px solid #ddd;
          }

          .project-table td {
            text-align: center;
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }

          .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
          }

          .status.in-progress {
            background-color: #d1ecf1;
            color: #0c5460;
          }

          .status.completed {
            background-color: #d4edda;
            color: #155724;
          }

          .edit-button,
          .delete-button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
          }

          .edit-button {
            color: #007bff;
          }

          .edit-button:hover {
            text-decoration: underline;
          }

          .delete-button {
            color: #ff4d4d;
          }

          .delete-button:hover {
            text-decoration: underline;
          }
        `}
      </style>

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
  );
};

export default ProjectPage; 