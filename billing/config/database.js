let dbConnection = {};

dbConnection = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  charset: process.env.CHARSET,
  pool: { maxConnections: 50, maxIdleTime: 60000 },
};


const dbConfig = {
  client: "mysql2",
  connection: dbConnection,
  pool: {
    afterCreate: function (conn, done) {
      conn.query("SET SESSION sql_mode='REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'", function (err) { done(err, conn); });
    },
  },
};

const knex = require("knex")(dbConfig);

exports.knex = knex;
exports.dbConnection = dbConnection;
exports.dbConfig = dbConfig;
