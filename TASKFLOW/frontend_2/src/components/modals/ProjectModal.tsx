import React, { useState, useEffect } from 'react';
import '../../styles/ProjectModal.css';

interface ProjectModalProps {
  onClose: () => void;
  onSave: (data: ProjectData) => Promise<void>;
  initialData: ProjectData | null;
  isOpen: boolean;
}

export interface ProjectData {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  onClose,
  onSave,
  initialData,
  isOpen
}) => {
  const defaultProjectData: ProjectData = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'IN_PROGRESS'
  };

  const [projectData, setProjectData] = useState<ProjectData>(initialData || defaultProjectData);

  useEffect(() => {
    if (isOpen) {
      setProjectData(initialData || defaultProjectData);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!projectData.name.trim()) {
        alert('프로젝트 제목을 입력해주세요.');
        return;
      }
      if (!projectData.startDate) {
        alert('시작 날짜를 선택해주세요.');
        return;
      }
      if (!projectData.endDate) {
        alert('종료 날짜를 선택해주세요.');
        return;
      }

      if (new Date(projectData.startDate) > new Date(projectData.endDate)) {
        alert('시작일은 종료일보다 늦을 수 없습니다.');
        return;
      }

      await onSave(projectData);
      onClose();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{initialData ? '프로젝트 수정' : '새 프로젝트'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>시작 날짜</label>
            <input
              type="date"
              value={projectData.startDate}
              onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>종료 날짜</label>
            <input
              type="date"
              value={projectData.endDate}
              onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>프로젝트 제목</label>
            <input
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              placeholder="프로젝트 제목을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label>프로젝트 설명</label>
            <textarea
              value={projectData.description}
              onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
              placeholder="프로젝트 설명을 입력하세요"
              rows={4}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="save-btn">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal; 