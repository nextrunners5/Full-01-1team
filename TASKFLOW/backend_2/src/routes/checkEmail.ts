import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "이메일이 제공되지 않았습니다." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE email = ?",
      [email]
    );

    const count = (rows as any[])[0].count;
    
    if (count > 0) {
      return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
    }

    res.status(200).json({ message: "사용 가능한 이메일입니다." });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

export default router;
