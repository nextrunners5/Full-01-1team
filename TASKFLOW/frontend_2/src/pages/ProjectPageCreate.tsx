import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import completeIcon from '../assets/complete.png';

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
        <div style={styles.contentContainer}>
            <div style={styles.headerContainer}>
                <h2 style={styles.title}>새 프로젝트 생성</h2>
                <p style={styles.subtitle}>프로젝트에 대한 기본 정보를 입력해주��요.</p>
            </div>
            <div className="project-creation-container" style={styles.container}>
                <div style={styles.formGroup}>
                    <label htmlFor="projectName" style={styles.label}>프로젝트 이름</label>
                    <input
                        type="text"
                        id="projectName"
                        placeholder="프로젝트 이름을 입력하세요"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="projectDescription" style={styles.label}>프로젝트 설명</label>
                    <textarea
                        id="projectDescription"
                        placeholder="프로젝트에 대한 설명을 입력하세요"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        style={styles.textarea}
                    ></textarea>
                </div>

                <div style={styles.formDates}>
                    <div style={styles.formGroup}>
                        <label htmlFor="startDate" style={styles.label}>시작일</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={styles.dateInput}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="endDate" style={styles.label}>종료 예정일</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={styles.dateInput}
                        />
                    </div>
                </div>

                <div style={styles.formButtons}>
                    <button style={styles.cancelButton}>취소</button>
                    <button onClick={handleProjectCreation} style={styles.createButton}>프로젝트 생성</button>
                </div>
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>프로젝트 생성 완료</h2>
                            <span style={styles.modalClose} onClick={closeModal}>×</span>
                        </div>
                        <div style={styles.modalBodyCentered}>
                            <img src={completeIcon} alt="Complete" style={styles.completeIcon} />
                            <p style={styles.modalMessage}>
                                프로젝트가 성공적으로 생성되었습니다.
                            </p>
                            <p style={{ marginBottom: '20px', fontSize: '16px', color: '#333' }}>
                                아래의 새로운 프로젝트가 생성되었습니다:
                            </p>
                            <p style={styles.projectName}>{projectName}</p>
                            <div style={styles.detailsBox}>
                                <p style={styles.modalDetails}><strong>프로젝트 ID:</strong> PRJ-2024-0001</p>
                                <p style={styles.modalDetails}><strong>생성 일시:</strong> {new Date().toLocaleString()}</p>
                            </div>
                        </div>
                        <div style={styles.modalFooterCompact}>
                            <button style={styles.completeButton} onClick={handleComplete}>완료</button>
                            <button style={styles.closeButton} onClick={closeModal}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    contentContainer: {
        margin: '0 auto',
        padding: '20px',
        width: '100%',
        maxWidth: '1200px',
        boxSizing: 'border-box',
        backgroundColor: '#F4F5FC',
        position: 'relative',
    },
    headerContainer: {
        textAlign: 'left',
        marginBottom: '20px',
        maxWidth: '900px',
        margin: '0 auto',
    },
    container: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '40px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        maxWidth: '900px',
        margin: '0 auto',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '20px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        minHeight: '120px',
    },
    formDates: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    },
    dateInput: {
        width: '100%',
        maxWidth: '300px',
        padding: '10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    formButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    createButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#ccc',
        color: '#333',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '30px',
        width: '480px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        position: 'relative',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    modalTitle: {
        fontSize: '22px',
        fontWeight: 'bold',
        margin: '0',
    },
    modalClose: {
        fontSize: '22px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    modalBodyCentered: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    completeIcon: {
        width: '130px',
        height: '100px',
        marginBottom: '10px',
    },
    modalMessage: {
        fontSize: '16px',
        marginBottom: '20px',
        color: '#333',
    },
    projectName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
    },
    detailsBox: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '6px',
        border: '1px solid #e0e0e0',
        marginBottom: '20px',
        textAlign: 'left',
    },
    modalDetails: {
        fontSize: '15px',
        color: '#666',
        marginBottom: '5px',
    },
    modalFooterCompact: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    closeButton: {
        padding: '12px 80px',
        backgroundColor: '#e0e0e0',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    completeButton: {
        padding: '12px 80px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default ProjectPageCreate; 