import pool from '../config/database';

export interface ScheduleAttributes {
  id?: number;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  userId: number;
}

export class ScheduleModel {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM schedules');
    return rows;
  }

  static async create(data: ScheduleAttributes) {
    const [result] = await pool.query(
      'INSERT INTO schedules (title, description, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)',
      [data.title, data.description, data.startDate, data.endDate, data.userId]
    );
    return { id: (result as any).insertId, ...data };
  }

  static async update(id: number, data: Partial<ScheduleAttributes>) {
    await pool.query(
      'UPDATE schedules SET ? WHERE id = ?',
      [data, id]
    );
    return this.findById(id);
  }

  static async findById(id: number) {
    const [rows] = await pool.query('SELECT * FROM schedules WHERE id = ?', [id]);
    return (rows as any[])[0];
  }
} 