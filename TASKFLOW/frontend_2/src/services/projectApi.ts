import axios from "axios";

// BASEURL, HTTP 통신 프로토콜(application/json 등등..) 옵션 설정 추가
const API = axios.create({ baseURL: "http://localhost:3500/api" });

interface Project {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await API.get("/projects");
    return response.data;
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
    const response = await API.get(`/projects/${projectId}`);
    return response.data;
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