import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "test-mysql.c9aacka00jcg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "rlatngus7!",
  database: "mysqldb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; 