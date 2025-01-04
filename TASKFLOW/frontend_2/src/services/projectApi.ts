import API from '../api/axiosConfig';
import type { Project, ProjectStatus, NewProject } from '../types/project';

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await API.get<Project[]>("/projects");
    return response.data;
  } catch (error) {
    console.error("Fetch projects error:", error);
    throw new Error("프로젝트를 불러오는 중 오류가 발생했습니다.");
  }
};

export const createProject = async (projectData: NewProject): Promise<Project> => {
  try {
    const response = await API.post<Project>("/projects", projectData);
    return {
      ...response.data,
      status: response.data.status as ProjectStatus
    };
  } catch (error) {
    console.error("Create project error:", error);
    throw new Error("프로젝트 생성 중 오류가 발생했습니다.");
  }
};

export const updateProject = async (projectId: number, projectData: Partial<Project>): Promise<Project> => {
  try {
    const response = await API.put<Project>(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error("Update project error:", error);
    throw new Error("프로젝트 수정 중 오류가 발생했습니다.");
  }
};

export const deleteProject = async (projectId: number): Promise<void> => {
  try {
    await API.delete(`/projects/${projectId}`);
  } catch (error) {
    console.error("Delete project error:", error);
    throw new Error("프로젝트 삭제 중 오류가 발생했습니다.");
  }
};

export const fetchProjectById = async (projectId: string): Promise<Project> => {
  try {
    const response = await API.get<Project>(`/projects/${projectId}`);
    return {
      ...response.data,
      status: response.data.status as ProjectStatus
    };
  } catch (error) {
    console.error("Fetch project by ID error:", error);
    throw new Error("프로젝트를 불러오는 중 오류가 발생했습니다.");
  }
};

export type { Project, NewProject }; 