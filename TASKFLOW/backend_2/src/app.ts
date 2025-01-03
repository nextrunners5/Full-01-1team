import dotenv from "dotenv";
import express, { Request, Response } from "express";
import sequelize from "./config/db";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes";
import signupRouter from "./routes/signupRouter"

dotenv.config(); // 환경 변수 로드

const app = express();
const PORT = process.env.PORT || 3500;

// 미들웨어 설정
app.use(express.json());

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// 라우트 설정
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
// 회원가입 라우트 등록
app.use("/api/signup", signupRouter);

// 데이터베이스 연결 및 서버 실행
(async () => {
  try {
    await sequelize.sync();
    console.log("데이터베이스 연결 성공");

    // 간단한 API 엔드포인트 추가
    app.get("/api/test", (req: Request, res: Response) => {
      res.json({ message: "API 연동 성공!", dbStatus: "connected" });
    });

    app.get("/", (req: Request, res: Response) => {
      res.send("Welcome to the Backend API");
    });
    

    // 서버 실행
    app.listen(PORT, () => {
      console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    });
  } catch (err) {
    console.error("애플리케이션 실행 중 오류 발생:", (err as Error).message);
    process.exit(1);
  }
})();
