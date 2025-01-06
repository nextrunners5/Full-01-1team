import React from 'react';
import '../../styles/ProjectDetail.css';

interface ProjectDetailProps {
  project: {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    members?: string[];
  };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailProps> = ({
  project,
  onClose,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'IN_PROGRESS':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      default:
        return status;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="detail-modal-content">
        <h3>프로젝트 상세</h3>
        
        <div className="detail-section">
          <div className="detail-row">
            <label>프로젝트명</label>
            <div className="detail-value">{project.title}</div>
          </div>
          
          <div className="detail-row">
            <label>상태</label>
            <div className="detail-value">
              <span className={`status ${project.status.toLowerCase()}`}>
                {getStatusText(project.status)}
              </span>
            </div>
          </div>

          <div className="detail-row">
            <label>기간</label>
            <div className="detail-value">
              {new Date(project.start_date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} - {new Date(project.end_date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {project.members && project.members.length > 0 && (
            <div className="detail-row">
              <label>참여 멤버</label>
              <div className="members-list">
                {project.members.map((member, index) => (
                  <span key={index} className="member-badge">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.description && (
            <div className="detail-row">
              <label>프로젝트 설명</label>
              <div className="detail-value description">
                {project.description}
              </div>
            </div>
          )}
        </div>

        <div className="detail-actions">
          <div className="left-actions">
            <button className="delete-btn" onClick={onDelete}>
              삭제
            </button>
          </div>
          <div className="right-actions">
            <button className="close-btn" onClick={onClose}>
              닫기
            </button>
            <button className="edit-btn" onClick={onEdit}>
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal; 