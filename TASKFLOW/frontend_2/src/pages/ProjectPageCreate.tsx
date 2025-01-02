import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import completeIcon from '../assets/complete.png';
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import "../styles/ProjectPageCreate.css";
import { createProject } from "../services/projectApi";

const ProjectCreationPage: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleProjectCreation = async (): Promise<void> => {
    try {
      const newProject = {
        name: projectName,
        description: projectDescription,
        startDate,
        endDate,
      };
      await createProject(newProject);
      setIsModalOpen(true);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    navigate('/project');
  };

  const handleCancel = (): void => {
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = (): void => {
    setIsCancelModalOpen(false);
  };

  const confirmCancel = (): void => {
    setIsCancelModalOpen(false);
    navigate('/project');
  };

  return (
    <div className="contentContainer">
      <Header />
      <Sidebar />
      <div className="headerContainer">
        <h2 className="title">새 프로젝트 생성</h2>
        <p className="subtitle">프로젝트에 대한 기본 정보를 입력해주세요.</p>
      </div>

      <div className="project-creation-container container">
        <div className="formGroup">
          <label htmlFor="projectName" className="label">
            프로젝트 이름
          </label>
          <input
            type="text"
            id="projectName"
            placeholder="프로젝트 이름을 입력하세요"
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
            placeholder="프로젝트에 대한 설명을 입력하세요"
            value={projectDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setProjectDescription(e.target.value)
            }
            className="textarea"
          ></textarea>
        </div>

        <div className="formDates">
          <div className="formGroup">
            <label htmlFor="startDate" className="label">
              시작일
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
              className="dateInput"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="endDate" className="label">
              종료 예정일
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
              className="dateInput"
            />
          </div>
        </div>

        <div className="formButtons">
          <button className="cancelButton" onClick={handleCancel}>
            취소
          </button>
          <button onClick={handleProjectCreation} className="createButton">
            프로젝트 생성
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h2 className="modalTitle">프로젝트 생성 완료</h2>
              <span className="modalClose" onClick={closeModal}>×</span>
            </div>
            <div className="modalBodyCentered">
              <img src={completeIcon} alt="Complete" className="completeIcon" />
              <p className="modalMessage">새로운 프로젝트 '{projectName}'이 생성되었습니다.</p>
              <div className="detailsBox">
                <p className="modalDetails"><strong>프로젝트 이름:</strong> {projectName}</p>
                <p className="modalDetails"><strong>프로젝트 ID:</strong> PRJ-2024-0001</p>
                <p className="modalDetails"><strong>생성 일시:</strong> {new Date().toLocaleString()}</p>
              </div>
            </div>
            <div className="modalFooterCompact">
              <button className="completeButton" onClick={closeModal}>완료</button>
              <button className="closeButton" onClick={closeModal}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {isCancelModalOpen && (
        <div className="modalOverlay">
          <div className="cancelModalContent">
            <div className="modalBodyCentered">
              <img src={completeIcon} alt="Cancelled" className="cancelIcon" />
              <h2 className="cancelTitle">취소되었습니다</h2>
              <p className="cancelMessage">프로젝트 생성이 취소되었습니다.</p>
            </div>
            <div className="modalFooterCompact">
              <button className="confirmButton" onClick={confirmCancel}>확인</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProjectCreationPage;

