const mysql = require("mysql");

class DB {
  connection = null;

  constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "admin",
      database: "default",
    });
  }

  executeQuery(query) {
    return this.connectAndExecuteQuery(query).then((result) => {
      return result;
    });
  }

  connectAndExecuteQuery(query) {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log("Connected!");
        this.connection.query(query, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    });
  }
}

module.exports = DB;
