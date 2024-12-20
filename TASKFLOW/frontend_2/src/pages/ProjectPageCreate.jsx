import React, { useState } from 'react';

const ProjectCreationPage = () => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleProjectCreation = () => {
        console.log({
            projectName,
            projectDescription,
            startDate,
            endDate,
        });
        alert('프로젝트가 생성되었습니다!');
    };

    return (
        <div style={styles.contentContainer}>
            <div style={styles.headerContainer}>
                <h2 style={styles.title}>새 프로젝트 생성</h2>
                <p style={styles.subtitle}>프로젝트에 대한 기본 정보를 입력해주세요.</p>
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
        </div>
    );
};

const styles = {
    contentContainer: {
        margin: '0 auto',
        padding: '20px',
        width: '100%',
        maxWidth: '1200px', // 콘텐츠 전체 폭을 조정하여 넓힘
        boxSizing: 'border-box',
        backgroundColor: '#F4F5FC',
    },
    headerContainer: {
        textAlign: 'left',
        marginBottom: '20px',
    },
    container: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '40px', // 내부 여백을 넓혀 큼직하게 조정
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        maxWidth: '900px', // 박스의 최대 크기를 늘림
        margin: '0 auto', // 중앙 정렬
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
    },
    dateInput: {
        width: '100%',
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
};

export default ProjectCreationPage;
