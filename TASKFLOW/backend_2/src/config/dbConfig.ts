export const dbConfig = {
  host: "test-mysql.c9aacka00jcg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "rlatngus7!",
  database: "mysqldb",
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',
  connectionLimit: 10,
  connectTimeout: 10000,
  supportBigNumbers: true,
  bigNumberStrings: true,
  multipleStatements: true,
  dateStrings: true,
  typeCast: true,
  flags: [
    '-FOUND_ROWS',
    '-IGNORE_SPACE',
    '+LOCAL_FILES',
    '+LONG_FLAG',
    '+LONG_PASSWORD',
    '+MULTI_RESULTS',
    '+PROTOCOL_41',
    '+PS_MULTI_RESULTS',
    '+TRANSACTIONS',
    '+SECURE_CONNECTION',
    '+CONNECT_WITH_DB'
  ]
}; 