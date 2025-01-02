import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3500/api' });

export interface Schedule {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  projectId?: string;
}

export const scheduleApi = {
  getAllSchedules: () => API.get('/schedules'),
  getScheduleById: (id: string) => API.get(`/schedules/${id}`),
  createSchedule: (data: Schedule) => API.post('/schedules', data),
  updateSchedule: (id: string, data: Schedule) => API.put(`/schedules/${id}`, data),
  deleteSchedule: (id: string) => API.delete(`/schedules/${id}`),
  getSchedulesByProject: (projectId: string) => API.get(`/schedules/project/${projectId}`)
}; 