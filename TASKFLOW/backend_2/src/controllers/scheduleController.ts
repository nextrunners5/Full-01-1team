import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../config/auth';

export const getAllSchedules = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM schedules WHERE user_id = ?',
      [req.user?.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error getting schedules:', error);
    res.status(500).json({ error: "일정을 가져오는데 실패했습니다." });
  }
};

export const createSchedule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const [result] = await pool.query(
      'INSERT INTO schedules (title, description, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, startDate, endDate, req.user?.id]
    );
    res.status(201).json({ 
      id: (result as any).insertId,
      title,
      description,
      startDate,
      endDate,
      userId: req.user?.id
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: "일정 생성에 실패했습니다." });
  }
};

export const updateSchedule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [result] = await pool.query(
      'UPDATE schedules SET ? WHERE id = ? AND user_id = ?',
      [req.body, req.params.id, req.user?.id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "일정을 찾을 수 없습니다." });
    }
    
    const [rows] = await pool.query(
      'SELECT * FROM schedules WHERE id = ?',
      [req.params.id]
    );
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: "일정 수정에 실패했습니다." });
  }
};

export const deleteSchedule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM schedules WHERE id = ? AND user_id = ?',
      [req.params.id, req.user?.id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "일정을 찾을 수 없습니다." });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: "일정 삭제에 실패했습니다." });
  }
}; 