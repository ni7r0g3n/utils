// const mysql = require("mysql");
const MysqlConnector = require("./MysqlConnector");

class DB {
  static executeQuery(query) {
    return this.connectAndExecuteQuery(query).then((result) => {
      return result;
    });
  }

  static connectAndExecuteQuery(query) {
    return new Promise((resolve, reject) => {
      MysqlConnector.getConnection((err, connection) => {
        if (err) {
          console.log(err);
          connection.release();
          reject(err);
          return;
        }
        console.log("Connected!");
        connection.query(query, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
          connection.release();
        });
      });
    });
  }
}

module.exports = DB;
