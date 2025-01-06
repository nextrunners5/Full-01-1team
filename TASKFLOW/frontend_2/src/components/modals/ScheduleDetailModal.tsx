import React from 'react';
import '../../styles/ScheduleDetail.css';

interface ScheduleDetailProps {
  schedule: {
    id: number;
    title: string;
    description: string;
    start: Date;
    end: Date;
  };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ScheduleDetailModal: React.FC<ScheduleDetailProps> = ({
  schedule,
  onClose,
  onEdit,
  onDelete,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="modal-overlay">
      <div className="detail-modal-content">
        <h3>일정 상세</h3>
        
        <div className="detail-section">
          <div className="detail-row">
            <label>일정 제목</label>
            <div className="detail-value">{schedule.title}</div>
          </div>
          
          <div className="detail-row">
            <label>날짜</label>
            <div className="detail-value">{formatDate(schedule.start)}</div>
          </div>

          <div className="detail-row">
            <label>시간</label>
            <div className="detail-value">
              {formatTime(schedule.start)} - {formatTime(schedule.end)}
            </div>
          </div>

          {schedule.description && (
            <div className="detail-row">
              <label>설명</label>
              <div className="detail-value description">
                {schedule.description}
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

export default ScheduleDetailModal; 