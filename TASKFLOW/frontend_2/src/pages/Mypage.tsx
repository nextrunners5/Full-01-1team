import React, { useState, useEffect } from 'react';
import { User, ChevronRight, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Mypage.css';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import UserIcon from '../assets/user-icon.png';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';

interface UserInfo {
  name: string;
  email: string;
}

const Mypage: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await API.get('/users/me');
      setUserInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      toast.error('사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const handlePersonalInfoClick = () => {
    navigate('/personal-info-update');
  };

  return (
    <div className="flex-container">
      <Sidebar />
      <div className="project-container">
        <Header />
        <div className="content-wrapper">
          <div className="header-container">
            <h1 className="header-title">마이페이지</h1>
          </div>

          <div className="my-content">
            <div className="my-profile-box">
              <div className="profile-header">
                <img src={UserIcon} alt="프로필" className="avatar" />
                <h3>{userInfo?.name || '사용자'}</h3>
                <p className="email">{userInfo?.email || ''}</p>
              </div>
            </div>

            <div className="my-settings-box">
              <h3 className="section-title">개인 설정</h3>
              <div className="settings-list">
                <div 
                  className="settings-item"
                  onClick={handlePersonalInfoClick}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="settings-item-content">
                    <User size={20} />
                    <span>개인정보 수정</span>
                  </div>
                  <ChevronRight size={20} />
                </div>
                <div 
                  className="settings-item withdrawal"
                  onClick={() => navigate('/delete-account')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="settings-item-content">
                    <UserX size={20} />
                    <span>회원탈퇴</span>
                  </div>
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Mypage;
