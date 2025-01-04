import React, { useState } from 'react';
import '../../styles/ScheduleModal.css';

interface ScheduleModalProps {
  onSave: (data: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  }) => void;
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="schedule-modal-overlay">
      <div className="schedule-modal">
        <h2>새 일정 추가</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">시작 시간</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">종료 시간</label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="save-btn">저장</button>
            <button type="button" onClick={onClose} className="cancel-btn">취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal; 