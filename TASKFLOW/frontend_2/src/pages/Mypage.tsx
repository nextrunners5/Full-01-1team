import React from 'react'
import { User, ChevronRight, UserX } from 'lucide-react'
import '../styles/Mypage.css'
import Header from '../components/common/Header'
import Sidebar from '../components/common/Sidebar'
import Footer from '../components/common/Footer'
import UserIcon from '../assets/user-icon.png'

export default function Mypage() {
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
                <h3>김민수</h3>
                <p>프로젝트 매니저</p>
                <p>항상 최선을 다하는 매니저</p>
              </div>
            </div>

            <div className="my-settings-box">
              <h3 className="section-title">개인 설정</h3>
              <div className="settings-list">
                <div className="settings-item">
                  <div className="settings-item-left">
                    <User className="h-4 w-4" />
                    <span>개인정보 수정</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="settings-item withdrawal">
                  <div className="settings-item-left">
                    <UserX className="h-4 w-4" />
                    <span>회원탈퇴</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
