import API from '../api/axiosConfig';

export interface Schedule {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface TodaySchedule {
  date: string;
  dayOfWeek: string;
  schedules: {
    id: number;
    title: string;
    time: string;
    start_date: string;
    end_date: string;
  }[];
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
    const response = await API.get('/schedules');
    return response.data;
  },

  getTodaySchedules: async (): Promise<TodaySchedule> => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const response = await API.get('/schedules');
      const allSchedules = response.data;
      
      const todaySchedules = allSchedules.filter((schedule: Schedule) => {
        const scheduleDate = new Date(schedule.start_date);
        return scheduleDate >= today && scheduleDate < tomorrow;
      });

      return {
        date: today.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\.$/, ''),
        dayOfWeek: today.toLocaleString('ko-KR', { weekday: 'long' }),
        schedules: todaySchedules.map((schedule: Schedule) => ({
          id: schedule.id,
          title: schedule.title,
          time: new Date(schedule.start_date).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          start_date: schedule.start_date,
          end_date: schedule.end_date
        }))
      };
    } catch (error) {
      console.error('Failed to fetch today schedules:', error);
      throw error;
    }
  },

  createSchedule: async (schedule: ScheduleCreate): Promise<Schedule> => {
    const response = await API.post('/schedules', schedule);
    return response.data;
  },

  updateSchedule: async (id: number, schedule: Partial<ScheduleCreate>): Promise<Schedule> => {
    const response = await API.put(`/schedules/${id}`, schedule);
    return response.data;
  },

  deleteSchedule: async (id: number): Promise<void> => {
    await API.delete(`/schedules/${id}`);
  }
}; 