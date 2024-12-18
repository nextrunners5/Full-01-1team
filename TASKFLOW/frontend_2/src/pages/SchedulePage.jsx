import React from "react";
import TopBar from "../components/common/TopBar";
import MiddleBar from "../components/common/MiddleBar";
import BottomBar from "../components/common/BottomBar";
import ScheduleModal from "../components/modals/ScheduleModal";

const SchedulePage = () => {
  return (
    <div>
      {/* 상단 바 */}
      <TopBar />

      {/* 메인 레이아웃 */}
      <div style={{ display: "flex" }}>
        {/* 사이드 바 */}
        <MiddleBar />

        {/* 메인 콘텐츠 영역 */}
        <div style={{ flex: 1, backgroundColor: "#f5f5f5", position: "relative" }}>
          <h2 style={{ margin: "20px" }}>MONTH {'<'} 12 {'>'}</h2>
          {/* 일정 추가 모달 */}
          <ScheduleModal />
        </div>
      </div>

      {/* 하단 바 */}
      <BottomBar />
    </div>
  );
};

export default SchedulePage;
