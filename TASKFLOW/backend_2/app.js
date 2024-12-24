require("dotenv").config(); // 환경 변수 로드
const express = require("express");
const connectDB = require("./config/db"); // 데이터베이스 연결
const authRoutes = require("./routes/authRoutes"); // 라우트 파일 연결
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3500;

// 미들웨어 설정
app.use(express.json()); // JSON 본문 처리

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000", // 허용할 프론트엔드 URL
    methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
    credentials: true // 쿠키 허용 시 true
  })
);

// 라우트 설정
app.use("/api/auth", authRoutes); // authRoutes 등록

// 데이터베이스 연결 및 서버 실행
(async () => {
  try {
    await connectDB();
    console.log("데이터베이스 연결 성공");

    // 간단한 API 엔드포인트 추가
    app.get("/api/test", (req, res) => {
      res.json({ message: "API 연동 성공!", dbStatus: "connected" });
    });

    app.get("/", (req, res) => {
      res.send("Welcome to the Backend API"); // 기본 응답 메시지
    });

    // 로그인, 회원가입 API 예시
    app.post("/auth/login", (req, res) => {
      res.json({ message: "로그인 성공!" });
    });

    app.post("/auth/signup", (req, res) => {
      res.json({ message: "회원가입 성공!" });
    });

    // 서버 실행
    app.listen(PORT, () => {
      console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    });
  } catch (err) {
    console.error("애플리케이션 실행 중 오류 발생:", err.message);
    process.exit(1);
  }
})();
