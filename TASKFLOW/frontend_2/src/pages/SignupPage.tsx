import React, { useState } from "react";

const SignupForm: React.FC = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthdate: "",
    gender: "",
    idNumber: "",
    agree1: false,
    agree2: false
  });

  // Handles changes to input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // Update state based on input type (checkbox vs text)
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Mock function to simulate email duplication check
  const handleEmailDuplicationCheck = () => {
    // Simulated API call to check email duplication
    if (formData.email === "test@example.com") {
      alert("이미 사용 중인 이메일입니다.");
    } else {
      alert("사용 가능한 이메일입니다.");
    }
  };

  // Saves form data (mock implementation)
  const saveData = (data: typeof formData) => {
    // Here, you would normally send the data to an API or save it to localStorage
    console.log("Saving data:", data);
    alert("회원가입 정보가 저장되었습니다.");
  };

  // Sends form data to the backend API
  const sendToBackend = async (data: typeof formData) => {
    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submission behavior
    saveData(formData); // Saves form data
  };

  return (
    <div style={customStyles.container}>
      <h1 style={customStyles.title}>회원가입</h1>
      <p style={customStyles.subtitle}>
        서비스 이용을 위해 회원가입이 필요합니다
      </p>

      <form onSubmit={handleSubmit}>
        {/* Email input field with duplication check button */}
        <label htmlFor="email">이메일 주소</label>
        <div style={customStyles.emailContainer}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            style={customStyles.input}
          />
          <button
            type="button"
            onClick={handleEmailDuplicationCheck}
            style={customStyles.verifyButton}
          >
            이메일 중복확인
          </button>
        </div>

        {/* Password input fields */}
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="영문, 숫자, 특수문자 조합 8-20자"
          value={formData.password}
          onChange={handleChange}
          required
          style={customStyles.input}
        />

        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력해주세요"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={customStyles.input}
        />

        {/* Name input field */}
        <label htmlFor="name">이름 (닉네임)</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="이름을 입력해주세요"
          value={formData.name}
          onChange={handleChange}
          required
          style={customStyles.input}
        />

        {/* Birthdate input field */}
        <label htmlFor="birthdate">생년월일</label>
        <input
          type="date"
          id="birthdate"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          required
          style={customStyles.input}
        />

        {/* Gender selection (radio buttons) */}
        <label style={customStyles.inlineLabel}>성별</label>
        <div style={customStyles.inlineRadioGroup}>
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={handleChange}
          />
          <label htmlFor="male">남성</label>

          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={handleChange}
          />
          <label htmlFor="female">여성</label>
        </div>

        {/* ID number input field */}
        <label htmlFor="idNumber">주민등록번호</label>
        <input
          type="text"
          id="idNumber"
          name="idNumber"
          placeholder="주민등록번호를 입력해주세요"
          value={formData.idNumber}
          onChange={handleChange}
          style={customStyles.input}
        />

        {/* Consent checkboxes */}
        <div style={customStyles.checkboxGroup}>
          <input
            type="checkbox"
            id="agree1"
            name="agree1"
            checked={formData.agree1}
            onChange={handleChange}
            required
          />
          <label htmlFor="agree1">
            <a
              href="#"
              style={customStyles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              개인정보 수집 및 이용 동의 (필수)
            </a>
          </label>
        </div>

        <div style={customStyles.checkboxGroup}>
          <input
            type="checkbox"
            id="agree2"
            name="agree2"
            checked={formData.agree2}
            onChange={handleChange}
            required
          />
          <label htmlFor="agree2">
            <a
              href="#"
              style={customStyles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              제3자 정보제공 동의 (필수)
            </a>
          </label>
        </div>

        {/* Submit button */}
        <button type="submit" style={customStyles.button}>
          회원가입 완료
        </button>
      </form>
    </div>
  );
};

const customStyles = {
  container: {
    width: "400px",
    margin: "auto",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "10px"
  },
  subtitle: {
    textAlign: "center" as const,
    marginBottom: "20px",
    color: "#555"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px"
  },
  emailContainer: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "15px"
  },
  verifyButton: {
    padding: "10px",
    backgroundColor: "#4A90E2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  inlineRadioGroup: {
    display: "row",
    gap: "10px",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: "15px"
  },
  inlineLabel: {
    display: "inline-block",
    marginBottom: "5px"
  },
  checkboxGroup: {
    display: "row",
    alignItems: "center",
    marginBottom: "15px"
  },
  link: {
    textDecoration: "none",
    color: "#4A90E2"
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4A90E2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default SignupForm;
