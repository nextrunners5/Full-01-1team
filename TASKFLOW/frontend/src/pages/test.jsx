import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 로직 (예: API 호출)
    // 여기서는 예시로 실패를 가정
    const isLoginSuccessful = false; // 실제 로그인 성공 여부에 따라 변경

    if (!isLoginSuccessful) {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setError("");
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
    </div>
  );
};

export default Login;
