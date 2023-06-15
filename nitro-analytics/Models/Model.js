const Database = require("../DB/DB");
const QueryBuilder = require("../DB/QueryBuilder");

class Model {
  DB = null;
  table = null;
  fields = [];
  primaryKey = "id";
  currentModel = null;

  // accepts an object that has the same keys as the fields
  constructor(childModel, obj) {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        this[key] = obj[key];
      });
      this[this.primaryKey] = obj[this.primaryKey];
    }
    this.currentModel = childModel;
  }

  create(obj) {
    let keys = this.fields;
    return new QueryBuilder(this.currentModel)
      .table(this.table)
      .create()
      .insert(...keys)
      .values(...keys.map((key) => new QueryBuilder().escape(obj[key])))
      .run()
      .then((result) => {
        this.fields.forEach((key) => {
          this[key] = result[key];
        });
      });
  }

  find(id) {
    return new QueryBuilder(this.currentModel)
      .table(this.table)
      .select(...this.fields, this.primaryKey)
      .where(this.primaryKey, id)
      .first();
  }

  update(obj) {
    return new QueryBuilder(this.currentModel)
      .table(this.table)
      .update()
      .set(
        ...this.fields.map(
          (key) => key + "=" + new QueryBuilder().escape(obj[key])
        )
      )
      .where(this.primaryKey, obj[this.primaryKey])
      .run()
      .then((result) => {
        this.fields.forEach((key) => {
          this[key] = result[key];
        });
      });
  }

  delete(...ids) {
    ids.forEach((id) => {
      new QueryBuilder(this.currentModel)
        .table(this.table)
        .delete()
        .where(this.primaryKey, id)
        .run();
    });
  }

  where(field, operator = "=", value) {
    return new QueryBuilder(this.currentModel)
      .table(this.table)
      .select("*")
      .where(field, operator, value);
  }

  save() {
    this.find(this[this.primaryKey]).then((result) => {
      if (result.id) {
        this.update(this);
      } else {
        this.create(this);
      }
    });
  }
}

module.exports = Model;
