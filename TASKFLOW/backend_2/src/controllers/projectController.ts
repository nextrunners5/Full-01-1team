import { Request, Response } from 'express';
import db from '../models';

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await db.Project.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: '프로젝트 목록을 불러오는데 실패했습니다.' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await db.Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: '프로젝트 정보를 불러오는데 실패했습니다.' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await db.Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: '프로젝트 생성에 실패했습니다.' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const [updated] = await db.Project.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }
    const updatedProject = await db.Project.findByPk(req.params.id);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: '프로젝트 수정에 실패했습니다.' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const deleted = await db.Project.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: '프로젝트 삭제에 실패했습니다.' });
  }
};

export const deleteMultipleProjects = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    await db.Project.destroy({
      where: { id: ids }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: '프로젝트 삭제에 실패했습니다.' });
  }
}; 