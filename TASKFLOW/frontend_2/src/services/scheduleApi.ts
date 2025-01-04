import API from '../api/axiosConfig';

export interface Schedule {
  id?: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

export interface ScheduleResponse extends Schedule {
  id: number;
}

export const scheduleApi = {
  getSchedules: async (): Promise<ScheduleResponse[]> => {
    const response = await API.get<ScheduleResponse[]>('/schedules');
    return response.data;
  },
  
  createSchedule: async (schedule: Omit<Schedule, 'id'>): Promise<ScheduleResponse> => {
    const response = await API.post<ScheduleResponse>('/schedules', schedule);
    return response.data;
  },
  
  updateSchedule: async (id: number, schedule: Partial<Schedule>): Promise<ScheduleResponse> => {
    const response = await API.put<ScheduleResponse>(`/schedules/${id}`, schedule);
    return response.data;
  },
  
  deleteSchedule: async (id: number): Promise<void> => {
    await API.delete(`/schedules/${id}`);
  }
}; 