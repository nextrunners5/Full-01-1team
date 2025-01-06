import mysql from 'mysql2/promise';
import { PoolOptions } from 'mysql2';
import { dbConfig } from './dbConfig';

const pool = mysql.createPool({
  ...dbConfig,
  charset: 'utf8mb4',
  connectionLimit: 10,
  connectTimeout: 10000,
  supportBigNumbers: true,
  bigNumberStrings: true,
  typeCast: function castField(field: any, next: any) {
    if (field.type === 'VAR_STRING' || field.type === 'STRING') {
      return field.string();
    }
    return next();
  }
} as PoolOptions);

// 연결 테스트 시 character set 확인 추가
const testConnection = async () => {
  try {
    const [charset] = await pool.query('SHOW VARIABLES LIKE "character_set%"');
    console.log('Character set settings:', charset);
    
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', ['test2@example.com']);
    console.log('User data:', rows);
  } catch (error) {
    console.error('Database query failed:', error);
  }
};

// DB 데이터 확인
const checkUserData = async () => {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    console.log('All users:', users);
  } catch (error) {
    console.error('Query failed:', error);
  }
};

// 서버 시작 시 연결 테스트 실행
testConnection();

checkUserData();

export default pool; 