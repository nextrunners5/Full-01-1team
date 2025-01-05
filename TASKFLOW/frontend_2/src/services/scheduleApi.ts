import API from '../api/axiosConfig';

export interface Schedule {
  id: number;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

export interface ScheduleResponse {
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

const scheduleApi = {
  getSchedules: async (): Promise<ScheduleResponse[]> => {
    const response = await API.get('/schedules');
    return response.data;
  },

  getDailySchedules: async (date: string): Promise<ScheduleResponse[]> => {
    const response = await API.get(`/schedules/daily/${date}`);
    return response.data;
  },

  createSchedule: async (schedule: ScheduleCreate): Promise<ScheduleResponse> => {
    const response = await API.post('/schedules', schedule);
    return response.data;
  },

  updateSchedule: async (id: number, schedule: Partial<ScheduleCreate>): Promise<ScheduleResponse> => {
    const response = await API.put(`/schedules/${id}`, schedule);
    return response.data;
  },

  deleteSchedule: async (id: number): Promise<void> => {
    await API.delete(`/schedules/${id}`);
  }
};

export default scheduleApi; 