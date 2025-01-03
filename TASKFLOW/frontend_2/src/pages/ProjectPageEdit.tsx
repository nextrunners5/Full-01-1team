import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import "../styles/ProjectPageEdit.css";
import completeIcon from "../assets/complete.png";
import { fetchProjectById, updateProject } from '../services/projectApi';

interface PopupConfig {
  message: string;
  onClose: () => void;
}

const ProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectStatus, setProjectStatus] = useState<"진행 중" | "완료">("진행 중");
  const [popupConfig, setPopupConfig] = useState<PopupConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjectData = async () => {
      if (!id) {
        navigate('/project');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const projectData = await fetchProjectById(id);
        
        if (projectData) {
          setProjectName(projectData.name);
          setProjectDescription(projectData.description);
          setStartDate(projectData.startDate);
          setEndDate(projectData.endDate);
          setProjectStatus(projectData.status);
        }
      } catch (error) {
        console.error('프로젝트 데이터 로드 실패:', error);
        setError('프로젝트 데이터를 불러오는데 실패했습니다.');
        setTimeout(() => navigate('/project'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      if (!id) return;

      const projectData = {
        name: projectName,
        description: projectDescription,
        startDate,
        endDate,
        status: projectStatus
      };

      await updateProject(id, projectData);
      setPopupConfig({
        message: "프로젝트가 성공적으로 수정되었습니다.",
        onClose: () => navigate('/project')
      });
    } catch (error) {
      console.error('프로젝트 수정 실패:', error);
    }
  };

  const handleCancel = () => {
    setPopupConfig({
      message: "수정이 취소되었습니다.",
      onClose: () => navigate('/project')
    });
  };

  const closePopup = () => {
    if (popupConfig) {
      popupConfig.onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>프로젝트 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="contentContainer">
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="project-edit-container" style={{ flex: 1 }}>
          <div className="headerContainer">
            <h2 className="title">프로젝트 수정</h2>
            <p className="subtitle">프로젝트 정보를 수정해주세요.</p>
          </div>

          <div className="formGroup">
            <label htmlFor="projectName" className="label">
              프로젝트 이름
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="projectDescription" className="label">
              프로젝트 설명
            </label>
            <textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProjectDescription(e.target.value)}
              className="textarea"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="startDate" className="label">
              시작일
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="endDate" className="label">
              종료일
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="projectStatus" className="label">
              프로젝트 상태
            </label>
            <select
              id="projectStatus"
              value={projectStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                setProjectStatus(e.target.value as "진행 중" | "완료")}
              className="select"
            >
              <option value="진행 중">진행 중</option>
              <option value="완료">완료</option>
            </select>
          </div>

          <div className="buttons">
            <button className="cancel-btn" onClick={handleCancel}>
              취소
            </button>
            <button className="save-btn" onClick={handleSave}>
              저장하기
            </button>
          </div>

          {popupConfig && (
            <div className="popup-overlay">
              <div className="popup-content">
                <div className="popup-icon">
                  <img src={completeIcon} alt="완료 아이콘" />
                </div>
                <h2>
                  {popupConfig.message.includes("취소")
                    ? "취소되었습니다"
                    : "수정이 완료되었습니다"}
                </h2>
                <p>{popupConfig.message}</p>
                <button className="popup-button" onClick={closePopup}>
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectEditPage;
