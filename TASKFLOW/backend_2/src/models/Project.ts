import pool from '../config/database';

export interface ProjectAttributes {
  id?: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
}

export class ProjectModel {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM projects');
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    return (rows as any[])[0];
  }

  static async create(data: ProjectAttributes) {
    const [result] = await pool.query(
      'INSERT INTO projects (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      [data.name, data.description, data.startDate, data.endDate, data.status]
    );
    return { id: (result as any).insertId, ...data };
  }

  static async update(id: number, data: Partial<ProjectAttributes>) {
    await pool.query(
      'UPDATE projects SET ? WHERE id = ?',
      [data, id]
    );
    return this.findById(id);
  }
} 