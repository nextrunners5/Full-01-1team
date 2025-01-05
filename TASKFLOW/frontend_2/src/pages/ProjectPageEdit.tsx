import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { projectApi, Project } from '../services/projectApi';
import '../styles/ProjectPageEdit.css';

const ProjectPageEdit: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'IN_PROGRESS',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) return;
        const response = await projectApi.getProjectById(parseInt(projectId));
        setFormData({
          name: response.name,
          description: response.description,
          status: response.status,
          startDate: response.startDate,
          endDate: response.endDate
        });
      } catch (err: any) {
        console.error('프로젝트 조회 오류:', err);
        setError(err.message);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!projectId) return;
      await projectApi.updateProject(parseInt(projectId), formData);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('프로젝트 수정 오류:', err);
      setError(err.message);
    }
  };

  const handleConfirm = () => {
    setShowSuccessModal(false);
    navigate('/project');
  };

  return (
    <div className="flex-container">
      <Sidebar />
      <div className="project-container">
        <Header />
        <div className="project-form-container">
          <h2>프로젝트 수정</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="project-form">
            <div className="form-group">
              <label htmlFor="name">프로젝트명</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">설명</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">상태</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="IN_PROGRESS">진행 중</option>
                <option value="COMPLETED">완료</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">시작일</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">마감일</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="button-group">
              <button type="button" onClick={() => navigate('/project')} className="cancel-button">
                취소
              </button>
              <button type="submit" className="submit-button">
                수정
              </button>
            </div>
          </form>
        </div>
        <Footer />

        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>프로젝트 수정 완료</h3>
              <p>프로젝트가 성공적으로 수정되었습니다.</p>
              <div className="modal-buttons">
                <button onClick={handleConfirm} className="confirm-button">
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPageEdit;
