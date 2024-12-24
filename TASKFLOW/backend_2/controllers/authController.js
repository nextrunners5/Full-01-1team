const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");

// 회원가입
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  // 입력값 검증
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // 데이터베이스 연결
    const dbConnection = await connectDB();

    // 이메일 중복 확인
    const [existingUser] = await dbConnection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 데이터 삽입
    await dbConnection.execute(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    res.status(201).json({ message: "회원가입 성공!" });
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error.message);
    res.status(500).json({ error: "서버 오류" });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 입력값 검증
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // 데이터베이스 연결
    const dbConnection = await connectDB();

    // 사용자 검색
    const [rows] = await dbConnection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const user = rows[0];

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ token });
  } catch (error) {
    console.error("로그인 중 오류 발생:", error.message);
    res.status(500).json({ error: "서버 오류" });
  }
};
