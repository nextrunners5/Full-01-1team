import fs from "fs";
import path from "path";
import { Sequelize, DataTypes, Dialect } from "sequelize";
import { Sequelize as SequelizeType } from "sequelize/types";
import config from "../config/config.json";
import dotenv from "dotenv";

dotenv.config();

// 현재 파일 이름
const basename = path.basename(__filename);

/* (1) config.json의 각 환경설정 타입 정의
 *  - password가 null 가능하므로 string | null
 *  - dialect는 Sequelize가 지원하는 Dialect('mysql'|'postgres'|'mariadb'|'mssql'|'sqlite' 등)로 제한
 *  - use_env_variable 항목은 제거 (전혀 사용하지 않음) */
interface IDBConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: Dialect;
  // use_env_variable?: string;  <-- 제거
}

/* (2) config 전체 구조 */
interface IConfig {
  development: IDBConfig;
  test: IDBConfig;
  production: IDBConfig;
}

/* (3) config.json을 IConfig로 캐스팅*/
const typedConfig = config as IConfig;

/* (4) env를 'development'|'test'|'production' 중 하나로 제한 */
type EnvType = "development" | "test" | "production";
const env: EnvType = (process.env.NODE_ENV as EnvType) || "development";

/* (5) 최종 dbConfig 가져오기 */
const dbConfig = typedConfig[env];

/* (6) 모델들을 담아둘 객체 */
const db: { [key: string]: any } = {};

/** (7) Sequelize 인스턴스 생성
 *    - use_env_variable을 전혀 쓰지 않으므로, 항상 (database, username, password, options) 형태 */
let sequelize: SequelizeType;

sequelize = new Sequelize(
  dbConfig.database,               // database
  dbConfig.username,               // username
  dbConfig.password ?? undefined,  // password (null이면 undefined로 치환)
  {
    ...dbConfig,
    password: dbConfig.password ?? undefined,
  }
);

/* (8) 현재 디렉토리에서 .ts 파일을 불러와 모델에 등록 */
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&    // 숨김파일이 아님
      file !== basename &&         // 자기 자신(index.ts)이 아님
      file.slice(-3) === ".ts" &&
      file.indexOf(".test.ts") === -1
    );
  })
  .forEach((file) => {
    // model 정의 함수를 불러와 sequelize에 연결
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

/**
 * (9) 각 모델에 associate(관계설정) 메서드가 있다면 호출
 */
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

/**
 * (10) sequelize 인스턴스와 Sequelize 클래스를 함께 export
 */
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
