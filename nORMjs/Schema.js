const DB = require("./DB");

class Blueprint {
  tableName = null;
  fields = {};

  constructor(tableName) {
    this.tableName = tableName;
  }

  increments(name) {
    this.fields[name] = { type: "INT AUTO_INCREMENT PRIMARY KEY" };
    return this;
  }

  bigIncrements(name) {
    this.fields[name] = { type: "BIGINT AUTO_INCREMENT PRIMARY KEY" };
    return this;
  }

  string(name, length = 255) {
    this.fields[name] = { type: `VARCHAR(${length})` };
    return this;
  }

  integer(name) {
    this.fields[name] = { type: "INT" };
    return this;
  }

  bigInteger(name) {
    this.fields[name] = { type: "BIGINT" };
    return this;
  }

  float(name) {
    this.fields[name] = { type: "FLOAT" };
    return this;
  }

  unsignedInteger(name) {
    this.fields[name] = { type: "INT UNSIGNED" };
    return this;
  }

  unsignedBigInteger(name) {
    this.fields[name] = { type: "BIGINT UNSIGNED" };
    return this;
  }

  date(name) {
    this.fields[name] = { type: "DATE" };
    return this;
  }

  dateTime(name) {
    this.fields[name] = { type: "DATETIME" };
    return this;
  }

  timestamp(name) {
    this.fields[name] = { type: "TIMESTAMP" };
    return this;
  }

  timestamps() {
    this.fields["created_at"] = { type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" };
    this.fields["updated_at"] = {
      type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    };
    return this;
  }

  relation(columnName) {
    return new ForeignKeyBuilder(columnName, this);
  }

  // Generate create table query
  generateCreateQuery() {
    const fieldList = Object.entries(this.fields)
      .map(([name, { type }]) => `${name} ${type}`)
      .join(", ");
    return `CREATE TABLE ${this.tableName} (${fieldList});`;
  }

  // Generate alter table query
  generateAlterQuery() {
    const fieldList = Object.entries(this.fields)
      .map(([name, { type }]) => `${name} ${type}`)
      .join(", ");
    return `ALTER TABLE ${this.tableName} ${fieldList};`;
  }
}

class Schema {
  static create(tableName, callback) {
    const blueprint = new Blueprint(tableName);
    callback(blueprint);
    const migrationQuery = blueprint.generateCreateQuery();
    DB.executeQuery(migrationQuery);
  }

  static alter(tableName, callback) {
    const blueprint = new Blueprint(tableName);
    callback(blueprint);
    const alterQuery = blueprint.generateAlterQuery();
    DB.executeQuery(alterQuery);
  }

  static drop(tableName) {
    const dropQuery = `DROP TABLE ${tableName};`;
    DB.executeQuery(dropQuery);
  }
}

class ForeignKeyBuilder {
  columnName = null;
  parent = null;
  targetTable = null;
  targetColumn = null;

  constructor(columnName, parent) {
    this.columnName = columnName;
    this.parent = parent;
  }

  references(targetColumn) {
    this.targetColumn = targetColumn;
    return this;
  }

  on(targetTable) {
    this.targetTable = targetTable;
    this.parent.fields.push(
      `${this.columnName} INT UNSIGNED REFERENCES ${this.targetTable}(${this.targetColumn})`
    );
    return this.parent;
  }
}

module.exports = Schema;
