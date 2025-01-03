import express, { Request, Response } from "express";
import mysql, { RowDataPacket, OkPacket } from "mysql2/promise";
import bcrypt from "bcrypt";

const router = express.Router();

// 데이터베이스 연결 설정 (Promise 기반 API)
const db = mysql.createPool({
  host: "test-mysql.c9aacka00jcg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "rlatngus7!",
  database: "mysqldb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

router.post("/", async (req: Request, res: Response) => {
  const { email, password, name, birthdate, gender, idNumber } = req.body;

  // 입력값 검증
  if (!email || !password || !name || !birthdate || !gender) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  }

  // 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "유효하지 않은 이메일 형식입니다." });
  }

  // 비밀번호 길이 검사
  if (password.length < 6) {
    return res.status(400).json({ message: "비밀번호는 6자 이상이어야 합니다." });
  }

  try {
    // 이메일 중복 확인
    const checkEmailQuery = "SELECT COUNT(*) as count FROM users WHERE email = ?";
    const [checkResult] = await db.query<RowDataPacket[]>(checkEmailQuery, [email]);

    if (checkResult[0]?.count > 0) {
      return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 회원가입 쿼리 실행
    const insertQuery =
      "INSERT INTO users (email, password, name, birthdate, gender, idNumber) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [email, hashedPassword, name, birthdate, gender, idNumber];

    const [result] = await db.query<OkPacket>(insertQuery, values);

    // 회원가입 성공 응답
    res.status(201).json({
      message: "회원가입이 성공적으로 완료되었습니다.",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

export default router;
