import API from '../api/axiosConfig';

export interface Schedule {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface TodayScheduleItem {
  id: number;
  title: string;
  time: string;
  start_date: string;
  end_date: string;
}

export interface TodaySchedule {
  date: string;
  dayOfWeek: string;
  schedules: TodayScheduleItem[];
}

export interface ScheduleCreate {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface ScheduleData {
  id?: number | null;
  title: string;
  description: string;
  start: Date | null;
  end: Date | null;
}

export const scheduleApi = {
  getSchedules: async (): Promise<Schedule[]> => {
    try {
      const response = await API.get('/schedules');
      console.log('일정 목록 조회 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('일정 목록 조회 실패:', error);
      throw error;
    }
  },

  getTodaySchedules: async (): Promise<TodaySchedule> => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const response = await API.get('/schedules');
      const allSchedules = response.data;
      
      const todaySchedules = allSchedules.filter((schedule: Schedule) => {
        const startDate = new Date(schedule.start_date);
        const endDate = new Date(schedule.end_date);
        return (
          (startDate.toDateString() === today.toDateString()) ||
          (startDate < today && endDate >= today)
        );
      });

      const processedSchedules = todaySchedules.map((schedule: Schedule) => {
        const startDate = new Date(schedule.start_date);
        return {
          id: schedule.id,
          title: schedule.title,
          time: startDate < today ? '진행 중' :
            new Date(schedule.start_date).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
          start_date: schedule.start_date,
          end_date: schedule.end_date
        };
      });

      processedSchedules.sort((a: TodayScheduleItem, b: TodayScheduleItem) => {
        if (a.time === '진행 중') return -1;
        if (b.time === '진행 중') return 1;
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      });

      return {
        date: today.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\.$/, ''),
        dayOfWeek: today.toLocaleString('ko-KR', { weekday: 'long' }),
        schedules: processedSchedules
      };
    } catch (error) {
      console.error('오늘의 일정 조회 실패:', error);
      throw error;
    }
  },

  createSchedule: async (schedule: ScheduleCreate): Promise<Schedule> => {
    try {
      const response = await API.post('/schedules', schedule);
      console.log('일정 생성 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('일정 생성 실패:', error);
      throw error;
    }
  },

  updateSchedule: async (id: number, schedule: Partial<ScheduleCreate>): Promise<Schedule> => {
    const response = await API.put(`/schedules/${id}`, schedule);
    return response.data;
  },

  deleteSchedule: async (id: number): Promise<void> => {
    await API.delete(`/schedules/${id}`);
  },

  getScheduleById: async (id: number): Promise<Schedule> => {
    try {
      const response = await API.get(`/schedules/${id}`);
      console.log('일정 상세 조회:', response.data);
      return response.data;
    } catch (error) {
      console.error('일정 상세 조회 실패:', error);
      throw error;
    }
  }
}; 