import axios from 'axios';

const BASE_URL = '/api/projects';

export const projectApi = {
  getAllProjects: () => axios.get(BASE_URL),
  getProjectById: (id: number) => axios.get(`${BASE_URL}/${id}`),
  createProject: (data: any) => axios.post(BASE_URL, data),
  updateProject: (id: number, data: any) => axios.put(`${BASE_URL}/${id}`, data),
  deleteProject: (id: number) => axios.delete(`${BASE_URL}/${id}`),
  deleteMultipleProjects: (ids: number[]) => axios.post(`${BASE_URL}/delete-multiple`, { ids }),
}; 