import React, { useState } from 'react';

interface ScheduleModalProps {
  onSave: (data: { title: string; description: string; startTime: string; endTime: string }) => void;
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = () => {
    onSave({ title, description, startTime, endTime });
    onClose();
  };

  return (
    <div style={{
      backgroundColor: 'white',
      width: '500px',
      margin: 'auto',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)',
      position: 'absolute',
      top: '20%',
      left: '50%',
      transform: 'translate(-50%, -20%)'
    }}>
      <h3>일정 추가</h3>
      <div style={{ marginBottom: '10px' }}>
        <label>시작 시간</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ marginLeft: '10px', marginBottom: '10px' }} />
        <label style={{ marginLeft: '20px' }}>종료 시간</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ marginLeft: '10px' }} />
      </div>
      <div>
        <label>일정 제목</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="일정 제목을 입력하세요" style={{ width: '100%', margin: '10px 0', padding: '5px' }} />
      </div>
      <div>
        <label>일정 설명</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="일정에 대한 설명을 입력하세요" style={{ width: '100%', height: '80px', padding: '5px' }}></textarea>
      </div>
      <div style={{ textAlign: 'right' }}>
        <button onClick={onClose} style={{ marginRight: '10px', backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>삭제</button>
        <button onClick={onClose} style={{ marginRight: '10px', backgroundColor: '#ddd', padding: '5px 10px' }}>취소</button>
        <button onClick={handleSave} style={{ backgroundColor: '#0000ff', color: 'white', border: 'none', padding: '5px 10px' }}>저장</button>
      </div>
    </div>
  );
};

export default ScheduleModal; 