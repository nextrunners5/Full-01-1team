import axios from "axios";

// BASEURL, HTTP 통신 프로토콜(application/json 등등..) 옵션 설정 추가
const API = axios.create({ 
  baseURL: "http://localhost:3500/api",
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Project {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "진행 중" | "완료";
}

export interface ProjectResponse {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "진행 중" | "완료";
}

// 서버 응답 데이터를 프론트엔드 형식으로 변환
const transformProjectData = (data: any): Project => ({
  id: data.id,
  name: data.name || '',
  description: data.description || '',
  startDate: data.startDate || '',
  endDate: data.endDate || '',
  status: data.status || "진행 중"
});

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await API.get("/projects");
    return response.data.map(transformProjectData);
  } catch (error) {
    console.error("Fetch projects error:", error);
    throw new Error("프로젝트를 불러오는 중 오류가 발생했습니다.");
  }
};

export const createProject = async (projectData: Project): Promise<Project> => {
  try {
    const response = await API.post("/projects", projectData);
    return response.data;
  } catch (error) {
    console.error("Create project error:", error);
    throw new Error("프로젝트 생성 중 오류가 발생했습니다.");
  }
};

export const fetchProjectById = async (projectId: string): Promise<Project> => {
  try {
    console.log('Fetching project with ID:', projectId);
    const response = await API.get(`/projects/${projectId}`);
    console.log('Received project data:', response.data);
    
    if (!response.data) {
      throw new Error('프로젝트 데이터가 없습니다.');
    }

    const transformedData = transformProjectData(response.data);
    console.log('Transformed project data:', transformedData);
    
    return transformedData;
  } catch (error) {
    console.error("Fetch project by ID error:", error);
    throw new Error("프로젝트를 불러오는 중 오류가 발생했습니다.");
  }
};

export const updateProject = async (projectId: string, projectData: Project): Promise<Project> => {
  try {
    const response = await API.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error("Update project error:", error);
    throw new Error("프로젝트 수정 중 오류가 발생했습니다.");
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await API.delete(`/projects/${projectId}`);
  } catch (error) {
    console.error("Delete project error:", error);
    throw new Error("프로젝트 삭제 중 오류가 발생했습니다.");
  }
}; 