import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { projectApi } from '../services/projectApi';
import '../styles/ProjectPage.css';

const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'IN_PROGRESS',
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('폼 제출 시작');
    
    try {
      console.log('프로젝트 생성 요청 데이터:', formData);
      const response = await projectApi.createProject(formData);
      console.log('프로젝트 생성 응답:', response);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('프로젝트 생성 오류:', err);
      console.error('상세 에러:', err.response?.data);
      setError(err.response?.data?.message || err.message);
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
          <h2>새 프로젝트 생성</h2>
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
                생성
              </button>
            </div>
          </form>
        </div>
        <Footer />

        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>프로젝트 생성 완료</h3>
              <p>프로젝트가 성공적으로 생성되었습니다.</p>
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

export default ProjectCreatePage; 