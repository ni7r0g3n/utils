const mysql = require("mysql");
const MysqlConnector = require("./MysqlConnector");

class DB {
  static connection = MysqlConnector;

  static executeQuery(query) {
    return this.connectAndExecuteQuery(query).then((result) => {
      return result;
    });
  }

  static connectAndExecuteQuery(query) {
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
          this.connection.end();
        });
      });
    });
  }
}

module.exports = DB;
