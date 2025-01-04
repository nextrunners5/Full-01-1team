import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import '../styles/ProjectPageCreate.css';

interface ProjectData {
  projectName: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
}

const ProjectCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    projectDescription: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API 호출 로직
      navigate('/project');
    } catch (error) {
      console.error('프로젝트 생성 중 오류:', error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <div className="project-creation-content">
          <div className="header-container">
            <h2 className="title">새 프로젝트 생성</h2>
            <p className="subtitle">프로젝트에 대한 기본 정보를 입력해주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="project-form">
            <div className="form-group">
              <label htmlFor="projectName">프로젝트 이름</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={projectData.projectName}
                onChange={handleChange}
                placeholder="프로젝트 이름을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectDescription">프로젝트 설명</label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={projectData.projectDescription}
                onChange={handleChange}
                placeholder="프로젝트에 대한 설명을 입력하세요"
              />
            </div>

            <div className="form-group">
              <label htmlFor="startDate">시작일</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={projectData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">종료일</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={projectData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="button-group">
              <button type="button" className="cancel-btn" onClick={() => navigate('/project')}>
                취소
              </button>
              <button type="submit" className="save-btn">
                생성하기
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProjectCreationPage;

