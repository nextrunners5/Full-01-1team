import React, { useState } from "react";
import Header from "../components/common/Header.tsx";
import Sidebar from "../components/common/Sidebar.tsx";
import Footer from "../components/common/Footer.tsx";
import ScheduleModal from "../components/modals/ScheduleModal.tsx";

const SchedulePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (data: { title: string; description: string; startTime: string; endTime: string }) => {
    console.log("일정 저장:", data);
    handleCloseModal();
  };

  return (
    <div>
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, backgroundColor: "#f5f5f5", position: "relative" }}>
          <h2 style={{ margin: "20px" }}>일정 관리</h2>
          <button onClick={handleOpenModal}>일정 추가</button>
          {isModalOpen && (
            <ScheduleModal onSave={handleSave} onClose={handleCloseModal} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SchedulePage; 