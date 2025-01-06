import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { toast, ToastContainer } from 'react-toastify';
import API from '../api/axiosConfig';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/PersonalInfoPage.css";
import { Eye, EyeOff } from 'lucide-react';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  gender: string;
}

interface FormData {
  name: string;
  email: string;
  birthdate: string;
  gender: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  idNumberFront: string;
  idNumberBack: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  // MySQL date format (YYYY-MM-DD)을 input date value로 변환
  return dateString.split('T')[0];
};

const formatGender = (gender: string) => {
  switch (gender) {
    case 'male':
      return '남성';
    case 'female':
      return '여성';
    case 'other':
      return '기타';
    default:
      return '';
  }
};

const PersonalInfoUpdate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    birthdate: "",
    gender: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    idNumberFront: "",
    idNumberBack: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await API.get('/users/me');
      const userInfo: UserInfo = response.data;
      
      console.log('Fetched user info:', userInfo);

      setFormData(prev => ({
        ...prev,
        name: userInfo.name || '',
        email: userInfo.email || '',
        birthdate: userInfo.birthdate || '',
        gender: userInfo.gender || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        idNumberFront: '',
        idNumberBack: ''
      }));
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      if ((error as any).response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('사용자 정보를 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      // 6자리 입력 완료시 자동으로 다음 입력칸으로 포커스
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
    
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      if (formData.idNumberFront.length !== 6 || formData.idNumberBack.length !== 7) {
        toast.error('주민등록번호를 정확히 입력해주세요.');
        return;
      }
    }

    try {
      const updateData = {
        name: formData.name,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          idNumber: `${formData.idNumberFront}-${formData.idNumberBack}`
        })
      };

      await API.put('/users/me', updateData);
      
      await fetchUserInfo();
      
      toast.success('개인정보가 성공적으로 수정되었습니다.');
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        idNumberFront: '',
        idNumberBack: ''
      }));

      setShowPasswords({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
      });

    } catch (error: any) {
      if (error.response?.status === 401) {
        if (error.response.data.error.includes('주민등록번호')) {
          toast.error('주민등록번호가 일치하지 않습니다.');
        } else {
          toast.error('현재 비밀번호가 일치하지 않습니다.');
        }
      } else {
        toast.error('개인정보 수정에 실패했습니다.');
        console.error('Error updating personal info:', error);
      }
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (isLoading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="Update-flex-container">
      <Sidebar />
      <div className="Update-main-container">
        <Header />
        <main className="personal-info-content">
          <h2>개인정보 수정</h2>
          <form onSubmit={handleSubmit} className="personal-info-form">
            <div className="Update-form-group">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="Update-form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
              />
            </div>

            <div className="Update-form-group">
              <label htmlFor="birthdate">생년월일</label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="Update-form-group">
              <label htmlFor="gender">성별</label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={formatGender(formData.gender)}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="Update-form-group">
              <label htmlFor="currentPassword">현재 비밀번호</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.currentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                >
                  {showPasswords.currentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="Update-form-group">
              <label htmlFor="newPassword">새 비밀번호 (선택사항)</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  minLength={8}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => togglePasswordVisibility('newPassword')}
                >
                  {showPasswords.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="Update-form-group">
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {formData.newPassword && (
              <div className="Update-form-group">
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
                    required={!!formData.newPassword}
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
                    required={!!formData.newPassword}
                  />
                </div>
                <small className="help-text">비밀번호 변경을 위해 주민등록번호를 입력해주세요.</small>
              </div>
            )}

            <div className="Update-button-group">
              <button type="button" onClick={() => navigate('/mypage')} className="Update-cancel-btn">
                취소
              </button>
              <button type="submit" className="Update-save-btn">
                저장
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

export default PersonalInfoUpdate;