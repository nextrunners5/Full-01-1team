import React, { useState, useEffect } from 'react';
import { User, ChevronRight, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Mypage.css';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
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
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await API.get('/users/me');
      setUserInfo(response.data);
    } catch (error) {
      console.error('Failed to get user info:', error);
      toast.error('사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const handlePersonalInfoClick = () => {
    navigate('/personal-info-update');
  };

  return (
    <div className="MP-flex-container">
      <Sidebar />
      <div className="MP-project-container">
        <Header />
        <div className="MP-content-wrapper">
          <div className="MP-header-container">
            <h1 className="MP-header-title">마이페이지</h1>
          </div>

          <div className="MP-my-content">
            <div className="my-profile-box">
              <div className="profile-header">
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