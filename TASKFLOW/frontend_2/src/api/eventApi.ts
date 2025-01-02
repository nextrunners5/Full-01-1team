import axios from 'axios';

const BASE_URL = '/api/events';

export const eventApi = {
  getAllEvents: () => axios.get(BASE_URL),
  getEventById: (id: number) => axios.get(`${BASE_URL}/${id}`),
  createEvent: (data: any) => axios.post(BASE_URL, data),
  updateEvent: (id: number, data: any) => axios.put(`${BASE_URL}/${id}`, data),
  deleteEvent: (id: number) => axios.delete(`${BASE_URL}/${id}`),
}; 