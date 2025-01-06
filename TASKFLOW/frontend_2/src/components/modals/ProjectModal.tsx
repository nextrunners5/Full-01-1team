import React, { useState } from 'react';
import '../../styles/ProjectModal.css';

interface ProjectModalProps {
  onClose: () => void;
  onSave: (data: ProjectData) => Promise<void>;
  initialData?: ProjectData | null;
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
  const [projectData, setProjectData] = useState<ProjectData>(
    initialData || {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'IN_PROGRESS'
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(projectData);
      onClose();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="project-modal">
        <h3>{initialData ? '프로젝트 수정' : '새 프로젝트'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="projectName">프로젝트명</label>
            <input
              id="projectName"
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              required
              placeholder="프로젝트 이름을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectDesc">설명</label>
            <textarea
              id="projectDesc"
              value={projectData.description}
              onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
              rows={4}
              placeholder="프로젝트 설명을 입력하세요"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">시작일</label>
              <input
                id="startDate"
                type="date"
                value={projectData.startDate}
                onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                required
                title="프로젝트 시작일"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">종료일</label>
              <input
                id="endDate"
                type="date"
                value={projectData.endDate}
                onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                required
                title="프로젝트 종료일"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="projectStatus">상태</label>
            <select
              id="projectStatus"
              value={projectData.status}
              onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
              title="프로젝트 상태"
            >
              <option value="IN_PROGRESS">진행 중</option>
              <option value="COMPLETED">완료</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="save-btn">
              {initialData ? '수정' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal; 