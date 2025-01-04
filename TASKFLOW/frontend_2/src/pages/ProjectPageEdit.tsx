import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import "../styles/ProjectPageEdit.css";

interface ProjectData {
  projectName: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
}

const ProjectEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    projectDescription: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // API 호출하여 프로젝트 데이터 가져오기
        // const response = await API.get(`/projects/${projectId}`);
        // setProjectData(response.data);
      } catch (error) {
        console.error('프로젝트 데이터 로드 중 오류:', error);
        navigate('/project');
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, navigate]);

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
      // API 호출하여 프로젝트 업데이트
      navigate('/project');
    } catch (error) {
      console.error('프로젝트 수정 중 오류:', error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <div className="project-edit-content">
          <div className="header-container">
            <h2 className="title">프로젝트 수정</h2>
            <p className="subtitle">프로젝트 정보를 수정해주세요.</p>
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
                저장하기
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProjectEditPage;
