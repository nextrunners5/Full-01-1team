import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import completeIcon from "../assets/complete.png";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import "../styles/ProjectPageEdit.css";

interface PopupConfig {
  message: string;
  onClose: () => void;
}

const ProjectEditPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectStatus, setProjectStatus] = useState("신규");
  const [popupConfig, setPopupConfig] = useState<PopupConfig | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      const data = {
        projectName: "AI 기반 프로젝트 관리 시스템",
        projectDescription: "인공지능을 활용한 효율적인 프로젝트 관리 시스템 개발",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        projectStatus: "진행중",
      };

      setProjectName(data.projectName);
      setProjectDescription(data.projectDescription);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setProjectStatus(data.projectStatus);
    };

    fetchProjectData();
  }, [projectId]);

  const handleSave = () => {
    setPopupConfig({
      message: "프로젝트 정보가 성공적으로 업데이트되었습니다.",
      onClose: () => navigate("/project"),
    });
  };

  const handleCancel = () => {
    setPopupConfig({
      message: "프로젝트 수정이 취소되었습니다.",
      onClose: () => navigate("/project"),
    });
  };

  const closePopup = () => {
    if (popupConfig?.onClose) {
      popupConfig.onClose();
    }
    setPopupConfig(null);
  };

  return (
    <div className="contentContainer">
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="project-edit-container" style={{ flex: 1 }}>
          <div className="breadcrumb" onClick={() => navigate("/project")}>
            <span>&lt; 뒤로가기</span>
          </div>
          <h1>프로젝트 수정</h1>
          <div className="form">
            <div className="form-group">
              <label htmlFor="projectName">프로젝트명</label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setProjectName(e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="projectDescription">프로젝트 설명</label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setProjectDescription(e.target.value)
                }
              />
            </div>
            <div className="date-group">
              <div className="form-group">
                <label htmlFor="startDate">시작일</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setStartDate(e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">종료일</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEndDate(e.target.value)
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="projectStatus">프로젝트 상태</label>
              <select
                id="projectStatus"
                value={projectStatus}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setProjectStatus(e.target.value)
                }
              >
                <option value="신규">신규</option>
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
              </select>
            </div>
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
