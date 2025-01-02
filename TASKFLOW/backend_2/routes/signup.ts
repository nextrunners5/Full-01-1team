import express, { Request, Response } from "express";
import { Connection, createConnection } from "mysql2";

const router = express.Router();

// 데이터베이스 연결 설정
const db: Connection = createConnection({
  host: "test-mysql.c9aacka00jcg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "rlatngus7!",
  database: "mysqldb"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database.");
});

// 회원가입 API
router.post("/", (req: Request, res: Response) => {
  const { email, password, name, birthdate, gender, idNumber } = req.body;

  if (!email || !password || !name || !birthdate || !gender) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  }

  const sql =
    "INSERT INTO users (email, password, name, birthdate, gender, idNumber) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [email, password, name, birthdate, gender, idNumber];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "회원가입에 실패했습니다." });
    }
    res.status(201).json({
      message: "회원가입이 성공적으로 완료되었습니다.",
      userId: result.insertId
    });
  });
});

export default router;
