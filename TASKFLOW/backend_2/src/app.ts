import express from "express";
import cors from "cors";
import routes from "./routes";
import pool from "./config/database";

const app = express();

// 미들웨어 설정
const corsOptions = {
  origin: [
    process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : 'http://3.34.135.200',
    'http://3.34.135.200:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

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

// API 라우트 설정 (모든 라우트가 /api 프리픽스를 가짐)
app.use('/api', routes);

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
