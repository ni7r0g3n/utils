const mysql = require("mysql");

const connection = mysql.createPool({
  connectionLimit: process.env ? process.env.DB_CONNECTION_LIMIT : 10,
  host: process.env ? process.env.DB_HOST : "localhost",
  user: process.env ? process.env.DB_USER : "root",
  password: process.env ? process.env.DB_PASSWORD : "admin",
  database: process.env ? process.env.DB_DATABASE : "default",
});

module.exports = connection;
