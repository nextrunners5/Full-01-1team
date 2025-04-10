import express from "express";
import cors from "cors";
import pool from "./config/database";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";

const app = express();

// 미들웨어 설정
const corsOptions = {
  origin: [
    process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : 'http://54.180.245.123',
    'http://54.180.245.123'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 데이터베이스 연결 테스트
pool.getConnection()
  .then(connection => {
    console.log('데이터베이스 연결 성공');
    connection.release();
  })
  .catch(err => {
    console.error('데이터베이스 연결 실패:', err);
    process.exit(1);
  });

// API 라우트 설정
app.use('/api', authRoutes);     // 인증 관련
app.use('/api', userRoutes);     // 사용자 관련
app.use('/api', projectRoutes);  // 프로젝트 관련
app.use('/api', scheduleRoutes); // 일정 관련

// 404 에러 핸들링
app.use((req, res) => {
  res.status(404).json({ error: "요청하신 경로를 찾을 수 없습니다." });
});

// 에러 핸들링 미들웨어
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "서버 오류가 발생했습니다." });
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

export default app;
