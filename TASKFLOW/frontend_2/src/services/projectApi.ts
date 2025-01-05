import API from '../api/axiosConfig';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

export const projectApi = {
  getAllProjects: async () => {
    try {
      const response = await API.get('/projects');
      console.log('API 응답:', response);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('프로젝트 목록 조회 API 에러:', error);
      throw new Error(error.response?.data?.message || '프로젝트 목록을 불러오는데 실패했습니다.');
    }
  },

  createProject: async (projectData: Omit<Project, 'id'>) => {
    try {
      console.log('API 요청 데이터:', projectData);
      const response = await API.post('/projects', projectData);
      console.log('API 응답:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API 에러:', error.response?.data || error);
      throw new Error(error.response?.data?.message || '프로젝트 생성에 실패했습니다.');
    }
  },

  updateProject: async (id: number, projectData: Partial<Project>) => {
    try {
      const response = await API.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '프로젝트 수정에 실패했습니다.');
    }
  },

  deleteProject: async (id: number) => {
    try {
      await API.delete(`/projects/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '프로젝트 삭제에 실패했습니다.');
    }
  },

  deleteMultipleProjects: async (ids: number[]) => {
    try {
      await API.post('/projects/delete-multiple', { ids });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '프로젝트 삭제에 실패했습니다.');
    }
  },

  getProjectById: async (id: number): Promise<Project> => {
    try {
      console.log('프로젝트 상세 조회 요청:', id);
      const response = await API.get(`/projects/${id}`);
      console.log('프로젝트 상세 조회 응답:', response.data);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('프로젝트 상세 조회 API 에러:', error);
      throw new Error(error.response?.data?.message || '프로젝트 정보를 불러오는데 실패했습니다.');
    }
  },
}; 