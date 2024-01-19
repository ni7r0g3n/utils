const DB = require("./DB");

class Blueprint {
  tableName = null;
  fields = [];

  constructor(tableName) {
    this.tableName = tableName;
  }
  //unsigned integer primary key
  id(name) {
    this.increments(name);
    return this;
  }

  increments(name) {
    this.fields.push(`${name} INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`);
    return this;
  }

  bigIncrements(name) {
    this.fields.push(`${name} BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`);
    return this;
  }

  string(name, length = 255) {
    this.fields.push(`${name} VARCHAR(${length})`);
    return this;
  }

  integer(name) {
    this.fields.push(`${name} INT`);
    return this;
  }

  bigInteger(name) {
    this.fields.push(`${name} BIGINT`);
    return this;
  }

  float(name) {
    this.fields.push(`${name} FLOAT`);
    return this;
  }

  unsignedInteger(name) {
    this.fields.push(`${name} INT UNSIGNED`);
    return this;
  }

  unsignedBigInteger(name) {
    this.fields.push(`${name} BIGINT UNSIGNED`);
    return this;
  }

  date(name) {
    this.fields.push(`${name} DATE`);
    return this;
  }

  dateTime(name) {
    this.fields.push(`${name} DATETIME`);
    return this;
  }

  timestamp(name) {
    this.fields.push(`${name} TIMESTAMP`);
    return this;
  }

  timestamps() {
    this.timestamp("created_at");
    this.timestamp("updated_at");
    return this;
  }

  softDeletes() {
    this.timestamp("deleted_at");
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
