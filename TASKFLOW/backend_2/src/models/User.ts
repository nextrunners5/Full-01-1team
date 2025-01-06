import pool from '../config/database';
import bcrypt from 'bcrypt';

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  name: string;
  birthdate?: string;
  gender?: string;
  id_number?: string;
}

export class UserModel {
  static async findByEmail(email: string) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return (rows as any[])[0];
  }

  static async findOne(options: { where: { email: string } }) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [options.where.email]
    );
    return (rows as any[])[0];
  }

  static async create(userData: UserAttributes) {
    const { email, password, name, birthdate, gender, id_number } = userData;
    
    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      `INSERT INTO users (email, password, name, birthdate, gender, id_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, name, birthdate, gender, id_number]
    );

    return {
      id: (result as any).insertId,
      email,
      name,
      birthdate,
      gender,
      id_number
    };
  }
} 