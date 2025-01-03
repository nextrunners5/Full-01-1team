import express, { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";

const router = express.Router();

// 데이터베이스 연결 설정 (Promise API)
const db = mysql.createPool({
  host: "test-mysql.c9aacka00jcg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "rlatngus7!",
  database: "mysqldb"
});

// 이메일 중복 확인 API
router.post("/check-email", async (req: Request, res: Response) => {
  const { email } = req.body;

  // 이메일 유효성 검사
  if (!email) {
    return res.status(400).json({ message: "이메일이 제공되지 않았습니다." });
  }

  try {
    // SQL 쿼리 실행
    const query = "SELECT COUNT(*) as count FROM users WHERE email = ?";
    const [rows] = await db.query<RowDataPacket[]>(query, [email]);

    // 결과 처리
    if (rows[0].count > 0) {
      return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
    }

    res.status(200).json({ message: "사용 가능한 이메일입니다." });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

export default router;
