import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects');
    res.json(rows);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: '프로젝트 목록을 불러오는데 실패했습니다.' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    const project = (rows as any[])[0];
    
    if (!project) {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ error: '프로젝트 정보를 불러오는데 실패했습니다.' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;
    const [result] = await pool.query(
      'INSERT INTO projects (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      [name, description, startDate, endDate, status]
    );
    res.status(201).json({ id: (result as any).insertId, ...req.body });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: '프로젝트 생성에 실패했습니다.' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'UPDATE projects SET ? WHERE id = ?',
      [req.body, req.params.id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }
    
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: '프로젝트 수정에 실패했습니다.' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM projects WHERE id = ?',
      [req.params.id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: '프로젝트 삭제에 실패했습니다.' });
  }
};

export const deleteMultipleProjects = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    const [result] = await pool.query(
      'DELETE FROM projects WHERE id IN (?)',
      [ids]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: '삭제할 프로젝트를 찾을 수 없습니다.' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting multiple projects:', error);
    res.status(500).json({ error: '프로젝트 삭제에 실패했습니다.' });
  }
}; 