require('dotenv').config(); // 환경 변수 로드
const mysql = require('mysql2/promise');

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });
        console.log('MySQL Connected...');
        return connection;
    } catch (err) {
        console.error('MySQL 연결 실패:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;