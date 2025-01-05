import React, { useEffect, useState } from 'react'
import { User, Bell, Moon, LogOut, ChevronRight, Plus, Star, Check } from 'lucide-react'
import '../styles/Mypage.css'
import profileImg from '../assets/profile.jpg'

// Types
interface ScheduleItem {
  id: string
  title: string
  time: string
  status: 'ongoing' | 'upcoming'
  dDay?: string
}

interface ActivityItem {
  id: string
  type: 'new' | 'complete'
  title: string
  date: string
  time: string
}

const SCHEDULES: ScheduleItem[] = [
  {
    id: '1',
    title: '주간 팀 미팅',
    time: '매주 월요일 10:00 AM',
    status: 'ongoing'
  },
  {
    id: '2',
    title: '프로젝트 마감일',
    time: '2024년 3월 15일',
    status: 'upcoming',
    dDay: 'D-7'
  }
]

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'new',
    title: '새로운 일정 추가',
    date: '2024년 3월 8일',
    time: '10분 전'
  },
  {
    id: '2',
    type: 'complete',
    title: '일정 완료',
    date: '디자인 리뷰 미팅',
    time: '14시간 전'
  }
]

export default function Dashboard() {
  const [theme, setTheme] = useState('light')
  const [isSwitchOn, setIsSwitchOn] = useState(true)

  useEffect(() => {
    document.body.classList.add('mypage')

    return () => {
      document.body.classList.remove('mypage')
    }
  }, [])

  return (
    <div className="my-dashboard">
      {/* Main Content */}
      <main className="my-main-content">
        <div className="my-content-wrapper">
          {/* 왼쪽 영역 - 프로필 및 설정 */}
          <div className="my-left-panel">
            {/* 프로필 박스 */}
            <div className="my-profile-box">
              <div className="profile-header">
                <div className="avatar">
                  <img src={profileImg} alt="김민수" className="avatar-img" />
                  <div>
                    <h2 className="font-semibold">김민수</h2>
                    <p className="text-sm text-muted-foreground">프로젝트 매니저</p>
                  </div>
                </div>
              </div>
              <p className="profile-description">항상 최선을 다하는 매니저가 되겠습니다.</p>
            </div>

            {/* 설정 박스 */}
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
                <div className="settings-item">
                  <div className="settings-item-left">
                    <Bell className="h-4 w-4" />
                    <span>알림 설정</span>
                  </div>
                  <button onClick={() => setIsSwitchOn(!isSwitchOn)}>{isSwitchOn ? '켜짐' : '꺼짐'}</button>
                </div>
                <div className="settings-item">
                  <div className="settings-item-left">
                    <Moon className="h-4 w-4" />
                    <span>테마 설정</span>
                  </div>
                  <select onChange={(e) => setTheme(e.target.value)} value={theme}>
                    <option value="light">라이트 모드</option>
                    <option value="dark">다크 모드</option>
                  </select>
                </div>
              </div>
              <div className="logout-section">
                <button className="my-logout-btn">
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽 영역 - 일정 */}
          <div className="my-right-panel">
            <div className="my-schedule-card">
              <div className="schedule-header">
                <h2 className="schedule-title">중요 일정</h2>
                <button className="add-btn">
                  <Plus className="h-4 w-4 mr-1" />
                  추가
                </button>
              </div>
              <div className="schedule-content">
                {SCHEDULES.map((schedule) => (
                  <div key={schedule.id} className="schedule-item">
                    <div className="schedule-item-left">
                      <Star className="star-icon" />
                      <div>
                        <h4 className="font-medium">{schedule.title}</h4>
                        <p className="text-sm text-muted-foreground">{schedule.time}</p>
                      </div>
                    </div>
                    <span className={`schedule-status ${schedule.dDay ? 'delayed' : ''}`}>
                      {schedule.dDay || '진행중'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-activity-card">
              <div className="activity-header">
                <h2 className="activity-title">최근 활동</h2>
              </div>
              <div className="activity-content">
                {ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon ${activity.type === 'new' ? 'new' : 'complete'}`}>
                      {activity.type === 'new' ? (
                        <Plus className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                    <div className="activity-details">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
