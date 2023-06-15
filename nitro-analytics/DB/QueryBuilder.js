const DB = require("./DB");

class QueryBuilder {
  DB = null;
  operation = null;
  requiresFrom = false;
  from = null;
  joins = [];
  sets = [];
  query = null;
  id = null;
  Model = null;

  constructor(Model) {
    this.DB = new DB();
    this.Model = Model;
    this.query = [];
  }

  escape(value) {
    return this.DB.connection.escape(value);
  }

  select(...fields) {
    this.operation = "SELECT " + fields.join(", ");
    this.requiresFrom = true;
    return this;
  }

  create(obj) {
    this.operation = "INSERT INTO";
    return this;
  }

  insert(...fields) {
    this.query.push("(" + fields.join(", ") + ")");
    return this;
  }

  values(...values) {
    values = values;
    this.query.push("VALUES (" + values.join(", ") + ")");
    return this;
  }

  update(id) {
    this.operation = "UPDATE";
    this.id = id;
    return this;
  }

  set(...fields) {
    this.sets.push("SET " + fields.join(", "));
    return this;
  }

  cleanUp() {
    this.query = [];
    this.operation = null;
    this.from = null;
    this.joins = [];
    this.id = null;
  }

  run() {
    let query = this.composeQuery();
    this.cleanUp();
    return this.DB.executeQuery(query);
  }

  delete() {
    this.operation = "DELETE";
    this.requiresFrom = true;
    return this;
  }

  table(from) {
    this.from = from;
    return this;
  }

  join(table, thisTableField, otherTableField) {
    this.joins.push(
      "JOIN " + table + " ON " + thisTableField + " = " + otherTableField
    );
    return this;
  }

  where(field, operator = "=", value) {
    let where = "";

    if (typeof value === "undefined") {
      value = operator;
      operator = "=";
    }

    if (this.query.length === 0) {
      where = "WHERE ";
    } else {
      where = "AND ";
    }

    this.query.push(where + field + " " + operator + " " + this.escape(value));
    return this;
  }

  orWhere(field, operator = "=", value) {
    let where = "";

    if (typeof value === "undefined") {
      value = operator;
      operator = "=";
    }

    if (this.query.length === 0) {
      where = "WHERE ";
    } else {
      where = "OR ";
    }

    this.query.push(where + field + " " + operator + " " + this.escape(value));
    return this;
  }

  composeQuery() {
    return (
      this.operation +
      " " +
      (this.requiresFrom ? "FROM " : "") +
      this.from +
      " " +
      this.joins.join(" ") +
      " " +
      this.sets.join(" ") +
      " " +
      this.query.join(" ")
    );
  }

  get() {
    let query = this.composeQuery();
    this.cleanUp();
    return this.DB.executeQuery(query).then((result) => {
      return result.map((row) => {
        return this.hydrateModel(row);
      });
    });
  }

  first() {
    let query = this.composeQuery() + " LIMIT 1";
    this.cleanUp();
    return this.DB.executeQuery(query).then((result) => {
      return this.hydrateModel(result[0]);
    });
  }

  hydrateModel(result) {
    return new this.Model(result);
  }
}

module.exports = QueryBuilder;
