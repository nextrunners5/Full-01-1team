import express from "express";
import cors from "cors";
import routes from "./routes";
import pool from "./config/database";

const app = express();

// 미들웨어 설정
app.use(cors());
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

// API 라우트 설정
app.use('/api', routes);

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

export default app;
