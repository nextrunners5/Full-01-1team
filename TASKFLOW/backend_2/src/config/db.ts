import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "test-mysql.c9aacka00jcg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "rlatngus7!",
  database: "mysqldb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 데이터베이스 연결 테스트
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

export default pool;