const QueryBuilder = require("./QueryBuilder");

class Model {
  static table = null;
  static fields = [];
  static primaryKey = "id";
  // currentModel = null;

  // accepts an object that has the same keys as the fields
  constructor(obj) {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        this[key] = obj[key];
      });

      this[this.constructor.primaryKey] = obj[this.constructor.primaryKey];
      this.fields = this.constructor.fields;
      this.table = this.constructor.table;
    }

    // this = childModel;
  }

  static create(obj) {
    let keys = this.fields;
    return new QueryBuilder(this)
      .table(this.table)
      .create()
      .insert(...keys)
      .values(...keys.map((key) => new QueryBuilder().escape(obj[key])))
      .run()
      .then((result) => {
        // var newObj = new this();
        // this.fields.forEach((key) => {
        //   newObj[key] = result[key];
        // });
        // return newObj;
        this.find(result.insertId).then((result) => {
          console.log({ result });
        });
        return this.find(result.insertId);
      });
  }

  static find(id) {
    return new QueryBuilder(this)
      .table(this.table)
      .select(...this.fields, this.primaryKey)
      .where(this.primaryKey, id)
      .first();
  }

  static update(obj) {
    return new QueryBuilder(this)
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
        var newObj = new this();
        this.fields.forEach((key) => {
          newObj[key] = result[key];
        });
        return this.find(obj[this.primaryKey]);
      });
  }

  update(obj) {
    // console.log(this);
    return new QueryBuilder(this)
      .table(this.table)
      .update()
      .set(
        ...this.fields.map(
          (key) => key + "=" + new QueryBuilder().escape(obj[key])
        )
      )
      .where(this.constructor.primaryKey, this[this.constructor.primaryKey])
      .run()
      .then((result) => {
        this.fields.forEach((key) => {
          this[key] = result[key];
        });
        console.log({ result });
        return this.constructor.find(this[this.constructor.primaryKey]);
      });
  }

  static delete(...ids) {
    var promises = [];
    ids.forEach((id) => {
      promises.push(
        new QueryBuilder(this)
          .table(this.table)
          .delete()
          .where(this.primaryKey, id)
          .run()
      );
    });
    return Promise.all(promises);
  }

  delete() {
    return new QueryBuilder(this)
      .table(this.table)
      .delete()
      .where(this.primaryKey, this[this.primaryKey])
      .run();
  }

  static where(field, operator = "=", value) {
    return new QueryBuilder(this)
      .table(this.table)
      .select("*")
      .where(field, operator, value);
  }

  static all(){
    return new QueryBuilder(this)
      .table(this.table)
      .select("*")
      .run();
  }

  // static where(field, value) {
  //   return new QueryBuilder(this)
  //     .table(this.table)
  //     .select("*")
  //     .where(field, "=", value);
  // }

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
