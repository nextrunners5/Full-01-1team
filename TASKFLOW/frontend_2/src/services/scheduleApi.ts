import API from '../api/axiosConfig';

export interface Schedule {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface ScheduleCreate {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export const scheduleApi = {
  getSchedules: async (): Promise<Schedule[]> => {
    const response = await API.get('/schedules');
    return response.data;
  },

  getTodaySchedules: async (): Promise<Schedule[]> => {
    const response = await API.get('/schedules/today');
    return response.data;
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