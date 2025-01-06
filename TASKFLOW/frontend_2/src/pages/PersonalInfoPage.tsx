import React, { useState } from "react";
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/PersonalInfoPage.css";
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

const PersonalInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "김민수",
    email: "minsu@example.com",
    phone: "010-1234-5678",
    department: "개발팀",
    position: "프로젝트 매니저",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 비밀번호 변경 시 유효성 검사
      if (formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
          toast.error('현재 비밀번호를 입력해주세요.');
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('새 비밀번호가 일치하지 않습니다.');
          return;
        }
      }

      // TODO: API 호출로 개인정보 업데이트
      await API.put('/user', {
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      toast.success('개인정보가 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('개인정보 수정에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate('/mypage');
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <main className="container">
          <h1 className="title">개인정보 수정</h1>
          <p className="subtitle">회원님의 개인정보를 안전하게 관리하세요.</p>

          <form className="info-form" onSubmit={handleSave}>
            <div className="input-group">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="input-group">
              <label htmlFor="phone">전화번호</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="department">부서</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="position">직책</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
            </div>

            <h3 className="password-title">비밀번호 변경</h3>
            
            <div className="input-group">
              <label htmlFor="currentPassword">현재 비밀번호</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="newPassword">새 비밀번호</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="button-group">
              <button type="button" className="cancel-button" onClick={handleCancel}>
                취소
              </button>
              <button type="submit" className="save-button">
                저장하기
              </button>
            </div>
          </form>
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </div>
  );
};

export default PersonalInfoPage; 