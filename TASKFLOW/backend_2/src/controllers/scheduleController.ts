import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../config/auth';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
    const { title, description, start_date, end_date } = req.body;
    
    // start_date와 end_date가 없으면 에러 반환
    if (!start_date || !end_date) {
      return res.status(400).json({ error: "시작 시간과 종료 시간은 필수입니다." });
    }

    const [result] = await pool.query(
      `INSERT INTO schedules 
       (title, description, start_date, end_date, user_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, new Date(start_date), new Date(end_date), req.user?.id]
    );
    
    res.status(201).json({ 
      id: (result as any).insertId,
      title,
      description,
      start_date,
      end_date,
      userId: req.user?.id,
      status: 'pending'
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

export const getTodaySchedules = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('User ID:', req.user.id);
    console.log('Today:', today);

    const [rows] = await pool.query(
      `SELECT 
        id, title, 
        DATE_FORMAT(start_date, '%Y-%m-%d %H:%i') as start_date,
        DATE_FORMAT(end_date, '%Y-%m-%d %H:%i') as end_date,
        DATE_FORMAT(
          CASE 
            WHEN DATE(start_date) < DATE(?) THEN ?
            ELSE start_date 
          END, 
          '%H:%i'
        ) as time
      FROM schedules 
      WHERE user_id = ? 
      AND (
        DATE(start_date) <= DATE(?) 
        AND DATE(end_date) >= DATE(?)
      )
      ORDER BY 
        CASE 
          WHEN DATE(start_date) < DATE(?) THEN 0
          ELSE 1 
        END,
        start_date ASC`,
      [today, today, req.user.id, today, today, today]
    );

    console.log('Query result:', rows);

    const schedules = rows as any[];
    const formattedDate = format(today, 'yyyy. MM. dd');
    const dayOfWeek = format(today, 'EEEE', { locale: ko });

    const processedSchedules = schedules.map(schedule => {
      if (new Date(schedule.start_date) < today) {
        return {
          ...schedule,
          time: '진행 중'
        };
      }
      return schedule;
    });

    res.json({
      date: formattedDate,
      dayOfWeek,
      schedules: processedSchedules
    });
  } catch (error) {
    console.error('Error getting today schedules:', error);
    res.status(500).json({ message: '오늘의 일정을 불러오는데 실패했습니다.' });
  }
}; 