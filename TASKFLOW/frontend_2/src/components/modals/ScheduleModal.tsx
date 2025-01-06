import React, { useState } from 'react';
import { ScheduleData } from '../../services/scheduleApi';
import '../../styles/Monthly.css';

interface ScheduleModalProps {
  onClose: () => void;
  onSave: (data: ScheduleData) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  initialData?: ScheduleData | null;
  isOpen: boolean;
  selectedDate?: Date;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose, onSave, onDelete, initialData, isOpen, selectedDate }) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>(
    initialData ? { ...initialData } : {
      title: '',
      description: '',
      start: null,
      end: null,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // 제목 검증
    if (!scheduleData.title.trim()) {
      newErrors.title = '일정 제목을 입력해주세요';
      isValid = false;
    }

    // 시작 시간 검증
    if (!scheduleData.start) {
      newErrors.start = '시작 시간을 선택해주세요';
      isValid = false;
    }

    // 종료 시간 검증
    if (!scheduleData.end) {
      newErrors.end = '종료 시간을 선택해주세요';
      isValid = false;
    }

    // 시작 시간과 종료 시간 비교
    if (scheduleData.start && scheduleData.end && scheduleData.start > scheduleData.end) {
      newErrors.end = '종료 시간은 시작 시간보다 늦어야 합니다';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      // 에러가 있을 경우 여기서 중단
      return;
    }

    try {
      await onSave(scheduleData as Required<ScheduleData>);
      setSuccessMessage(initialData ? '일정이 수정되었습니다!' : '새로운 일정이 추가되었습니다!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to save schedule:', error);
      setErrors({ submit: initialData ? '일정 수정에 실패했습니다.' : '일정 추가에 실패했습니다.' });
    }
  };

  const handleDelete = async () => {
    if (initialData?.id && onDelete) {
      try {
        await onDelete(initialData.id);
        setSuccessMessage('일정이 삭제되었습니다!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error('Failed to delete schedule:', error);
        setErrors({ submit: '일정 삭제에 실패했습니다.' });
      }
    }
  };

  return (
    <div className="M-modal-overlay">
      <div className="M-modal-content">
        <h3>{initialData ? '일정 수정' : '일정 추가'}</h3>
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}
        <div className="M-modal-row">
          <div>
            <label>시작 시간</label>
            <input
              type="datetime-local"
              required
              value={scheduleData.start ? scheduleData.start.toISOString().slice(0, 16) : ''}
              onChange={(e) => setScheduleData({
                ...scheduleData,
                start: e.target.value ? new Date(e.target.value) : null
              })}
            />
            {errors.start && <div className="error-message">{errors.start}</div>}
          </div>
          <div>
            <label>종료 시간</label>
            <input
              type="datetime-local"
              required
              value={scheduleData.end ? scheduleData.end.toISOString().slice(0, 16) : ''}
              onChange={(e) => setScheduleData({
                ...scheduleData,
                end: e.target.value ? new Date(e.target.value) : null
              })}
            />
            {errors.end && <div className="error-message">{errors.end}</div>}
          </div>
        </div>
        <div>
          <label>일정 제목</label>
          <input
            type="text"
            required
            value={scheduleData.title}
            onChange={(e) => setScheduleData({
              ...scheduleData,
              title: e.target.value
            })}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        <div>
          <label>일정 설명</label>
          <textarea
            rows={4}
            value={scheduleData.description}
            onChange={(e) => setScheduleData({
              ...scheduleData,
              description: e.target.value
            })}
          />
        </div>
        <div className="M-modal-buttons">
          {initialData?.id && onDelete && (
            <button 
              className="M-modal-delete-btn" 
              onClick={handleDelete}
            >
              삭제
            </button>
          )}
          <div className="M-modal-actions">
            <button className="M-modal-cancel-btn" onClick={onClose}>
              취소
            </button>
            <button className="M-modal-save-btn" onClick={handleSubmit}>
              {initialData ? '수정' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal; 