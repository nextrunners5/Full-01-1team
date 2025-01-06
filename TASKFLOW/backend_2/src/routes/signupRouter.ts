import { Router, Request, Response } from 'express';
import pool from '../config/database';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { email, password, name, birthdate, gender, idNumber } = req.body;

  try {
    // 비버깅을 위한 로그 추가
    console.log('Signup attempt with:', { email, name, birthdate, gender });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const encryptedIdNumber = idNumber ? encryptIdNumber(idNumber) : null;

    const [result] = await pool.query(
      `INSERT INTO users (email, password, name, birthdate, gender, id_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, name, birthdate, gender, encryptedIdNumber]
    );

    console.log('Insert result:', result);  // 결과 로그 추가

    res.status(201).json({ 
      success: true,
      message: "회원가입이 완료되었습니다." 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: "회원가입 중 오류가 발생했습니다." 
    });
  }
});

// 주민번호 암호화 함수
const encryptIdNumber = (idNumber: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'your-secret-key', 'salt', 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(idNumber, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
};

export default router;
