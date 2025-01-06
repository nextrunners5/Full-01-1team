import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/ScheduleModal.css';

const ScheduleModal = ({ onClose, onSave, initialData, isOpen }) => {
  const emptyState = {
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
  };

  // 초기 데이터가 있으면(수정 모드) 해당 데이터를 사용하고, 없으면(생성 모드) 빈 상태 사용
  const [scheduleData, setScheduleData] = useState(
    initialData ? { ...initialData } : emptyState
  );
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // 모달이 열릴 때마다 초기화 (수정 모드가 아닌 경우)
  useEffect(() => {
    if (isOpen && !initialData) {
      setScheduleData(emptyState);
      setErrors({});
      setSuccessMessage('');
    }
  }, [isOpen, initialData]);

  // initialData 변경 시 업데이트 (수정 모드)
  useEffect(() => {
    if (initialData) {
      setScheduleData({ ...initialData });
    }
  }, [initialData]);

  const resetForm = () => {
    setScheduleData(emptyState);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!scheduleData.title.trim()) {
      newErrors.title = '일정 제목을 입력해주세요';
    }
    
    if (!scheduleData.start) {
      newErrors.start = '시작 시간을 선택해주세요';
    }
    
    if (!scheduleData.end) {
      newErrors.end = '종료 시간을 선택해주세요';
    }

    if (scheduleData.start && scheduleData.end && scheduleData.start > scheduleData.end) {
      newErrors.end = '종료 시간은 시작 시간보다 늦어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSave(scheduleData);
        setSuccessMessage(
          initialData 
            ? '일정이 성공적으로 수정되었습니다!' 
            : '일정이 성공적으로 생성되었습니다!'
        );
        if (!initialData) {
          resetForm(); // 생성 모드에서만 폼 초기화
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        setErrors({ 
          submit: initialData 
            ? '일정 수정에 실패했습니다. 다시 시도해주세요.' 
            : '일정 생성에 실패했습니다. 다시 시도해주세요.' 
        });
      }
    }
  };

  const handleClose = () => {
    if (!initialData) {
      resetForm(); // 생성 모드에서만 폼 초기화
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{initialData ? '일정 수정' : '일정 추가'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="start-time">시작 시간 *</label>
            <input
              id="start-time"
              type="datetime-local"
              value={scheduleData.start instanceof Date ? scheduleData.start.toISOString().slice(0, 16) : ''}
              onChange={(e) => setScheduleData({ 
                ...scheduleData, 
                start: new Date(e.target.value)
              })}
              aria-label="시작 시간"
              required
            />
            {errors.start && <span className="error-message">{errors.start}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="end-time">종료 시간 *</label>
            <input
              id="end-time"
              type="datetime-local"
              value={scheduleData.end instanceof Date ? scheduleData.end.toISOString().slice(0, 16) : ''}
              onChange={(e) => setScheduleData({
                ...scheduleData,
                end: new Date(e.target.value)
              })}
              aria-label="종료 시간"
              required
            />
            {errors.end && <span className="error-message">{errors.end}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="title">일정 제목 *</label>
            <input
              id="title"
              type="text"
              value={scheduleData.title}
              onChange={(e) => setScheduleData({
                ...scheduleData,
                title: e.target.value
              })}
              placeholder="일정 제목을 입력하세요"
              required
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">일정 설명</label>
            <textarea
              id="description"
              value={scheduleData.description}
              onChange={(e) => setScheduleData({
                ...scheduleData,
                description: e.target.value
              })}
              placeholder="일정에 대한 설명을 입력하세요"
              rows={4}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={handleClose}
              className="cancel-btn"
              disabled={!!successMessage}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={!!successMessage}
            >
              {initialData ? '수정' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ScheduleModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  initialData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date)
  })
};

export default ScheduleModal;
