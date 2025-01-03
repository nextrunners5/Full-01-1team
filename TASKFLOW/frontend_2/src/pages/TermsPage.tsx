import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // v6 이상

const TermsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("terms");
  const navigate = useNavigate();

  const handleConfirm = () => {
    // "확인" 버튼 누르면 / 경로로 이동
    navigate("/signup");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "terms":
        return (
          <div>
            <h3>1. 목적</h3>
            <p>
              본 약관은 서비스 이름을 제공하는 회사 이름과 서비스를 이용하는 회원(이하 "회원")간의 권리, 의무 및 책임 사항을 규정합니다. 본 서비스는 일정 관리, 프로젝트 관리, 투두리스트 및 1:1 채팅 기능을 제공합니다.
            </p>
            <h3>2. 회원의 의무</h3>
            <ul>
              <li>회원은 서비스 이용 시 허위 정보를 입력하거나 타인의 개인정보를 도용하지 않아야 합니다.</li>
              <li>회원은 서비스 이용 과정에서 저작권, 초상권 등 타인의 권리를 침해해서는 안 됩니다.</li>
              <li>회원은 서비스를 악용하거나 서비스의 안정적 운영을 방해하는 행위를 금지합니다.</li>
            </ul>
            <h3>3. 회사의 책임</h3>
            <ul>
              <li>회사는 회원의 개인정보를 보호하며, 관련 법령에 따라 이를 처리합니다.</li>
              <li>회사는 서비스 제공과 관련하여 시스템의 안정성과 연속성을 유지하기 위해 노력합니다.</li>
              <li>회사는 서비스 운영 중단 시 사전에 회원에게 공지하며, 부득이한 경우 즉시 공지합니다.</li>
            </ul>
            <h3>4. 서비스의 변경 및 중단</h3>
            <p>회사는 서비스의 일부 또는 전체를 운영상 필요에 따라 변경하거나 중단할 수 있습니다. 회사는 서비스 중단 또는 변경 시, 이를 회원에게 사전 공지합니다. 단, 긴급한 경우 사후 공지가 가능합니다.</p>
            <h3>5. 서비스 이용 제한</h3>
            <p>회사는 회원이 다음 행위를 할 경우, 서비스 이용을 제한할 수 있습니다.</p>
            <ul>
                <li>약관 위반 또는 불법 행위</li>
                <li>타인의 권리를 침해하거나 부적절한 콘텐츠를 전송한 경우</li>
            </ul>
          </div>
        );
      case "policy":
        return (
          <div>
            <h3>1. 운영정책 기본원칙</h3>
            <p>본 운영정책은 서비스의 건전한 운영과 사용자 보호를 위해 수립되었으며, 모든 사용자는 이를 준수해야 합니다.</p>
            <h3>2. 금지행위</h3>
            <ul>
              <li>불법 정보의 게시 및 유포</li>
              <li>타인 명의 도용 및 무단 사용</li>
              <li>서비스 운영을 방해하는 모든 행위</li>
              <li>악성코드, 바이러스 등의 유포</li>
            </ul>
            <h3>3. 제재조치</h3>
            <ul>
              <li>경고 : 운영정책 위반시 1차 경고</li>
              <li>이용제한 : 반복적인 위반시 서비스 이용 제한</li>
              <li>영구정지 : 심각한 위반시 계정 영구 정지</li>
            </ul>
            <h3>4. 신고처리</h3>
            <p>신고된 내용은 운영팀 검토 후 24시간 이내 처리되며, 처리 결과는 신고자에게 통보됩니다.</p>
            <h3>5. 운영정책 기본원칙</h3>
            <p>운영정책은 서비스 환경 변화에 따라 수정될 수 있으며, 중요한 변경사항은 공지사항을 통해 안내됩니다.</p>
          </div>
        );
      case "privacy":
        return (
          <div>
            <h3>1. 개인정보의 수집 및 이용 목적</h3>
            <p>
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제 18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul>
                <li>회원 가입 및 관리</li>
                <li>서비스 제공 및 계약의 이행</li>
                <li>고객 상담 및 불만 처리</li>
            </ul>
            <h3>2. 개인정보의 보유 기간</h3>
            <p>회사는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
            <h3>3. 개인정보의 제3자 제공</h3>
            <p>회사는 정보주체의 별도 동의가 있는 경우나 법령에 특별한 규정이 있는 경우를 제외하고는 개인정보를 제3자에게 제공하지 않습니다.</p>
            <h3>4. 정보주체의 권리·의무 및 행사방법</h3>
            <ul>
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
            <h3>5. 개인정보의 안정성 확보조치</h3>
            <p>회사는 개인정보의 안정성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul>
              <li>관리적 조치 : 내부관리계획 수립·시행, 정기적 직원 교육</li>
              <li>기술적 조치 : 개인정보처리시스템 등의 접근권한 관리, 접근 통제시스템 설치</li>
              <li>물리적 조치 : 전산실, 자료보관실 등의 접근 통제</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>이용약관 및 정책</h1>
      <div style={styles.tabContainer}>
        <button
          style={activeTab === "terms" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("terms")}
        >
          이용약관
        </button>
        <button
          style={activeTab === "policy" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("policy")}
        >
          운영정책
        </button>
        <button
          style={activeTab === "privacy" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("privacy")}
        >
          개인정보처리방침
        </button>
      </div>
      <div style={styles.content}>{renderContent()}</div>
      <button style={styles.submitButton} onClick={handleConfirm}>확인</button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  tab: {
    flex: 1,
    padding: "10px",
    textAlign: "center" as const,
    cursor: "pointer",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
  },
  activeTab: {
    flex: 1,
    padding: "10px",
    textAlign: "center" as const,
    cursor: "pointer",
    border: "1px solid #ccc",
    backgroundColor: "#4A90E2",
    color: "#fff",
  },
  content: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  submitButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4A90E2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default TermsPage;
