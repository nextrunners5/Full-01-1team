import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // 환경 변수 로드

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

export default sequelize;