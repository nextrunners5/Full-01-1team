import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import completeIcon from '../assets/complete.png';
import "../styles/ProjectPageCreate.css";

const ProjectPageCreate: React.FC = () => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleProjectCreation = () => {
        console.log({
            projectName,
            projectDescription,
            startDate,
            endDate,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleComplete = () => {
        navigate('/project');
    };

    return (
        <div className="content-container">
            <div className="header-container">
                <h2 className="title">새 프로젝트 생성</h2>
                <p className="subtitle">프로젝트에 대한 기본 정보를 입력해주세요.</p>
            </div>
            <div className="project-creation-container">
                <div className="form-group">
                    <label htmlFor="projectName" className="label">프로젝트 이름</label>
                    <input
                        type="text"
                        id="projectName"
                        placeholder="프로젝트 이름을 입력하세요"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="projectDescription" className="label">프로젝트 설명</label>
                    <textarea
                        id="projectDescription"
                        placeholder="프로젝트에 대한 설명을 입력하세요"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="textarea"
                    ></textarea>
                </div>

                <div className="form-dates">
                    <div className="form-group">
                        <label htmlFor="startDate" className="label">시작일</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="date-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate" className="label">종료 예정일</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="date-input"
                        />
                    </div>
                </div>

                <div className="form-buttons">
                    <button className="cancel-button">취소</button>
                    <button onClick={handleProjectCreation} className="create-button">프로젝트 생성</button>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">프로젝트 생성 완료</h2>
                            <span className="modal-close" onClick={closeModal}>×</span>
                        </div>
                        <div className="modal-body-centered">
                            <img src={completeIcon} alt="Complete" className="complete-icon" />
                            <p className="modal-message">
                                프로젝트가 성공적으로 생성되었습니다.
                            </p>
                            <p className="modal-project-name">{projectName}</p>
                            <div className="details-box">
                                <p className="modal-details"><strong>프로젝트 ID:</strong> PRJ-2024-0001</p>
                                <p className="modal-details"><strong>생성 일시:</strong> {new Date().toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="modal-footer-compact">
                            <button className="complete-button" onClick={handleComplete}>완료</button>
                            <button className="close-button" onClick={closeModal}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectPageCreate; 