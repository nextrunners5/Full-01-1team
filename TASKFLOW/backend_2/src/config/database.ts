import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const pool = mysql.createPool({
  host: "test-mysql.c9aacka00jcg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "rlatngus7!",
  database: "mysqldb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 데이터베이스 초기화 함수
const initializeDatabase = async () => {
  try {
    // schema.sql 파일 읽기
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // 각 SQL 문을 분리하여 실행
    const queries = schema
      .split(';')
      .filter(query => query.trim())
      .map(query => query.trim() + ';');

    for (const query of queries) {
      if (query.length > 1) { // 빈 쿼리 제외
        await pool.query(query);
      }
    }

    console.log('데이터베이스 테이블이 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('데이터베이스 초기화 중 오류:', error);
  }
};

// 서버 시작 시 데이터베이스 초기화
initializeDatabase();

export default pool; 