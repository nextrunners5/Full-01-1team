export type ProjectStatus = "진행 중" | "완료";

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
}

export interface NewProject extends Omit<Project, 'id'> {
  id?: never;
} 