import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { toast, ToastContainer } from 'react-toastify';
import API from '../api/axiosConfig';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/PersonalInfoPage.css";

interface DeleteAccountForm {
  password: string;
  idNumberFront: string;
  idNumberBack: string;
  confirmText: string;
}

const DeleteAccount: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DeleteAccountForm>({
    password: "",
    idNumberFront: "",
    idNumberBack: "",
    confirmText: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (name === 'idNumberFront' && numericValue.length <= 6) {
      setFormData(prev => ({ ...prev, idNumberFront: numericValue }));
      if (numericValue.length === 6) {
        const backInput = document.getElementById('idNumberBack');
        if (backInput) {
          (backInput as HTMLInputElement).focus();
        }
      }
    } else if (name === 'idNumberBack' && numericValue.length <= 7) {
      setFormData(prev => ({ ...prev, idNumberBack: numericValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.confirmText !== "회원탈퇴") {
      toast.error('회원탈퇴 확인 문구를 정확히 입력해주세요.');
      return;
    }

    if (formData.idNumberFront.length !== 6 || formData.idNumberBack.length !== 7) {
      toast.error('주민등록번호를 정확히 입력해주세요.');
      return;
    }

    try {
      await API.delete('/users/me', {
        data: {
          password: formData.password,
          idNumber: `${formData.idNumberFront}-${formData.idNumberBack}`
        }
      });

      localStorage.removeItem('token');
      toast.success('회원 탈퇴가 완료되었습니다.');
      navigate('/login');
    } catch (error: any) {
      if (error.response?.status === 401) {
        if (error.response.data.error.includes('주민등록번호')) {
          toast.error('주민등록번호가 일치하지 않습니다.');
        } else {
          toast.error('비밀번호가 일치하지 않습니다.');
        }
      } else {
        toast.error('회원 탈퇴에 실패했습니다.');
        console.error('Error deleting account:', error);
      }
    }
  };

  return (
    <div className="flex-container">
      <Sidebar />
      <div className="main-container">
        <Header />
        <main className="personal-info-content">
          <h2>회원 탈퇴</h2>
          <div className="warning-box">
            <h3>⚠️ 주의사항</h3>
            <ul>
              <li>회원 탈퇴 시 모든 데이터가 영구적으로 삭제됩니다.</li>
              <li>삭제된 데이터는 복구할 수 없습니다.</li>
              <li>진행 중인 프로젝트와 스케줄이 모두 삭제됩니다.</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="personal-info-form">
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="idNumberFront">주민등록번호</label>
              <div className="id-number-input">
                <input
                  type="text"
                  id="idNumberFront"
                  name="idNumberFront"
                  value={formData.idNumberFront}
                  onChange={handleIdNumberChange}
                  placeholder="앞 6자리"
                  maxLength={6}
                  required
                />
                <span className="id-number-separator">-</span>
                <input
                  type="password"
                  id="idNumberBack"
                  name="idNumberBack"
                  value={formData.idNumberBack}
                  onChange={handleIdNumberChange}
                  placeholder="뒤 7자리"
                  maxLength={7}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmText">
                회원탈퇴를 진행하려면 "회원탈퇴"를 입력하세요
              </label>
              <input
                type="text"
                id="confirmText"
                name="confirmText"
                value={formData.confirmText}
                onChange={handleChange}
                required
                placeholder="회원탈퇴"
              />
            </div>

            <div className="button-group">
              <button type="button" onClick={() => navigate('/mypage')} className="cancel-btn">
                취소
              </button>
              <button type="submit" className="delete-btn">
                회원탈퇴
              </button>
            </div>
          </form>
        </main>
        <Footer />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DeleteAccount; 