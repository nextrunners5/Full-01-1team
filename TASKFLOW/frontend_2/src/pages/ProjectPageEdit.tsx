import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import completeIcon from '../assets/complete.png'; // 아이콘 이미지 가져오기
import "../styles/ProjectPageEdit.css"; // CSS 파일 임포트

interface ProjectParams {
  id: string;
}

const ProjectEditPage: React.FC = () => {
  const { id } = useParams<ProjectParams>();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [projectStatus, setProjectStatus] = useState<string>('신규');
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    // 프로젝트 데이터를 가져오는 로직
    // 예: fetchProjectData(id);
  }, [id]);

  const handleCancel = () => {
    navigate('/project');
  };

  const handleSave = () => {
    // 프로젝트 저장 로직
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate('/project');
  };

  return (
    <div className="edit-container">
      <h1>프로젝트 수정</h1>
      <div className="form">
        <div className="form-group">
          <label htmlFor="projectName">프로젝트 이름</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectDescription">프로젝트 설명</label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="date-group">
          <div className="form-group">
            <label htmlFor="startDate">시작일</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">종료일</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="projectStatus">프로젝트 상태</label>
          <select
            id="projectStatus"
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
          >
            <option value="신규">신규</option>
            <option value="진행중">진행중</option>
            <option value="완료">완료</option>
          </select>
        </div>
      </div>
      <div className="buttons">
        <button className="cancel-btn" onClick={handleCancel}>취소</button>
        <button className="save-btn" onClick={handleSave}>저장하기</button>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-icon">
              <img src={completeIcon} alt="완료 아이콘" />
            </div>
            <h2>수정이 완료되었습니다</h2>
            <p>프로젝트 정보가 성공적으로 업데이트되었습니다.</p>
            <button className="popup-button" onClick={closePopup}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectEditPage; 