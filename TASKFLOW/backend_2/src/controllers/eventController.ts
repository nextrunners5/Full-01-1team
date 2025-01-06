import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events');
    res.json(rows);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ error: '일정 목록을 불러오는데 실패했습니다.' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    const event = (rows as any[])[0];
    
    if (!event) {
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json({ error: '일정 정보를 불러오는데 실패했습니다.' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, startDate, endDate, userId } = req.body;
    const [result] = await pool.query(
      'INSERT INTO events (title, description, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, startDate, endDate, userId]
    );
    res.status(201).json({ id: (result as any).insertId, ...req.body });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: '일정 생성에 실패했습니다.' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'UPDATE events SET ? WHERE id = ?',
      [req.body, req.params.id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }
    
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: '일정 수정에 실패했습니다.' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM events WHERE id = ?',
      [req.params.id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: '일정 삭제에 실패했습니다.' });
  }
}; 