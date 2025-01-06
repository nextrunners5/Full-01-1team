import { Request, Response } from 'express';
import pool from '../config/database';
import { responseHandler } from '../utils/responseHandler';
import { logger } from '../utils/logger';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  startDate: Date;
  endDate: Date;
  userId: number;
}

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return responseHandler.error(res, 401, '인증이 필요합니다.');
    }

    const [rows] = await pool.query(
      `SELECT 
        id, 
        name, 
        description, 
        status,
        DATE_FORMAT(start_date, '%Y-%m-%d') as startDate,
        DATE_FORMAT(end_date, '%Y-%m-%d') as endDate,
        created_at as createdAt,
        updated_at as updatedAt
      FROM projects 
      WHERE user_id = ? 
      ORDER BY created_at DESC`,
      [req.user.id]
    );
    
    console.log('조회된 프로젝트 목록:', rows);
    responseHandler.success(res, 200, rows);
  } catch (error) {
    console.error('프로젝트 목록 조회 중 오류:', error);
    responseHandler.error(res, 500, '프로젝트 목록을 불러오는데 실패했습니다.');
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return responseHandler.error(res, 401, '인증이 필요합니다.');
    }

    const [rows] = await pool.query(
      `SELECT 
        id, 
        name, 
        description, 
        status,
        DATE_FORMAT(start_date, '%Y-%m-%d') as startDate,
        DATE_FORMAT(end_date, '%Y-%m-%d') as endDate,
        created_at as createdAt,
        updated_at as updatedAt
      FROM projects 
      WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    const project = (rows as any[])[0];
    
    if (!project) {
      return responseHandler.error(res, 404, '프로젝트를 찾을 수 없습니다.');
    }

    console.log('조회된 프로젝트:', project);
    responseHandler.success(res, 200, project);
  } catch (error) {
    console.error('프로젝트 조회 중 오류:', error);
    responseHandler.error(res, 500, '프로젝트 정보를 불러오는데 실패했습니다.');
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return responseHandler.error(res, 401, '인증이 필요합니다.');
    }

    const { name, description, startDate, endDate } = req.body;
    
    // 요청 데이터 로깅
    console.log('프로젝트 생성 요청 데이터:', {
      name,
      description,
      status: 'IN_PROGRESS',
      startDate,
      endDate,
      userId: req.user.id
    });

    // 필수 필드 검증
    if (!name || !startDate || !endDate) {
      console.log('필수 정보 누락:', { name, startDate, endDate });
      return responseHandler.error(res, 400, '필수 정보가 누락되었습니다.');
    }

    const [result] = await pool.query(
      `INSERT INTO projects 
        (name, description, status, start_date, end_date, user_id) 
       VALUES (?, ?, 'IN_PROGRESS', ?, ?, ?)`,
      [name, description, startDate, endDate, req.user.id]
    );

    console.log('INSERT 쿼리 결과:', result);

    const insertId = (result as any).insertId;
    
    const [newProject] = await pool.query(
      `SELECT 
        id, 
        name, 
        description, 
        status,
        DATE_FORMAT(start_date, '%Y-%m-%d') as startDate,
        DATE_FORMAT(end_date, '%Y-%m-%d') as endDate,
        created_at as createdAt,
        updated_at as updatedAt
      FROM projects 
      WHERE id = ?`,
      [insertId]
    );

    console.log('생성된 프로젝트:', newProject);

    responseHandler.success(res, 201, (newProject as any[])[0]);
  } catch (error) {
    console.error('프로젝트 생성 중 상세 오류:', error);
    logger.error('프로젝트 생성 중 오류:', error);
    responseHandler.error(res, 500, '프로젝트 생성에 실패했습니다.');
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { name, description, status, startDate, endDate } = req.body;
    const projectId = req.params.id;

    const [result] = await pool.query(
      `UPDATE projects 
       SET name = ?, description = ?, status = ?, 
           start_date = ?, end_date = ?
       WHERE id = ? AND user_id = ?`,
      [name, description, status, startDate, endDate, projectId, req.user?.id]
    );

    if ((result as any).affectedRows === 0) {
      return responseHandler.error(res, 404, '프로젝트를 찾을 수 없습니다.');
    }

    const [updatedProject] = await pool.query(
      `SELECT 
        id, 
        name, 
        description, 
        status,
        DATE_FORMAT(start_date, '%Y-%m-%d') as startDate,
        DATE_FORMAT(end_date, '%Y-%m-%d') as endDate,
        created_at as createdAt,
        updated_at as updatedAt
      FROM projects 
      WHERE id = ?`,
      [projectId]
    );

    responseHandler.success(res, 200, (updatedProject as any[])[0]);
  } catch (error) {
    console.error('프로젝트 수정 중 오류:', error);
    responseHandler.error(res, 500, '프로젝트 수정에 실패했습니다.');
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user?.id]
    );

    if ((result as any).affectedRows === 0) {
      return responseHandler.error(res, 404, '프로젝트를 찾을 수 없습니다.');
    }

    responseHandler.success(res, 200, { message: '프로젝트가 삭제되었습니다.' });
  } catch (error) {
    logger.error('프로젝트 삭제 중 오류:', error);
    responseHandler.error(res, 500, '프로젝트 삭제에 실패했습니다.');
  }
};

export const deleteMultipleProjects = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    const [result] = await pool.query(
      'DELETE FROM projects WHERE id IN (?) AND user_id = ?',
      [ids, req.user?.id]
    );

    if ((result as any).affectedRows === 0) {
      return responseHandler.error(res, 404, '삭제할 프로젝트를 찾을 수 없습니다.');
    }

    responseHandler.success(res, 200, { message: '프로젝트들이 삭제되었습니다.' });
  } catch (error) {
    logger.error('프로젝트 일괄 삭제 중 오류:', error);
    responseHandler.error(res, 500, '프로젝트 삭제에 실패했습니다.');
  }
}; 