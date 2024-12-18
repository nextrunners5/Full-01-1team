import React from 'react';

const MiddleBar = () => {
  return (
    <div style={{
      width: '220px',
      backgroundColor: '#f5f5f5',
      height: 'calc(100vh - 60px)',
      borderRight: '1px solid #ddd',
      padding: '10px'
    }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '15px 0', fontWeight: 'bold' }}>HOME</li>
        <li style={{ margin: '15px 0' }}>SCHEDULE MANAGEMENT</li>
        <li style={{ marginLeft: '20px' }}>Monthly</li>
        <li style={{ marginLeft: '20px' }}>Weekly</li>
        <li style={{ marginLeft: '20px' }}>Today</li>
        <li style={{ margin: '15px 0' }}>PROJECT</li>
        <li style={{ margin: '15px 0' }}>CHAT</li>
        <li style={{ margin: '15px 0' }}>MY PAGE</li>
      </ul>
    </div>
  );
};

export default MiddleBar;
