![Util version](https://img.shields.io/badge/Version-0.2-orange?style=for-the-badge)
![Development status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)

<br>
<br>

# **nORMjs** <div style="float: right"> ![javascript logo](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/20px-JavaScript-logo.png?20120221235433) </div>

**nORMjs** (node/ni7r0g3n ORM js) is a simple ORM for node.js express apps created to be easy to use and configure. It is intended to be used with MySQL, but it can also be used with any SQL database with a little tweaking of the source code. The usage flow is inspired by PHP's Eloquent ORM.

<br>

## Installation

As of now, this doesn't require any installation. Just include these files in your application and require them as needed.
I personally suggest this folder structure:

```
project-root/
├───DB/
│   ├───DB.js
│   ├───QueryBuilder.js
...
│───Models/
│   ├───Model.js
...
```
It will be eventually turned into a node package so that it can be installed and managed more easily.

## Usage

Once you place the models in your project you can create your models. Example:

```javascript
const Model = require("../Models/Model");

class User extends Model {

  // OPTIONAL
  constructor(initialData) {
    // Map the data to required structure if needed
    // Do stuff...
    super(initialData) 
  }

  // SETUP MODEL'S INFO (MANDATORY)
  // !! MUST ALL BE STATIC !!
  static table = "users" // name of the table the Model represents
  static primaryKey = "id" // model's primary key
  static fields = ["name", "email", "password", "created_at", "nationality", "banned_at"] // the fields to be pulled from the db
  static hidden = ["password"] // fields you don't want to appear

  function ban() {
    this.update({...this, banned_at: new Date().toISOString()})
  }

  static function ofNationality(nationality) {
    // ...
    // define custom scopes in your models
    return this.where('nationality', nationality);
    // ...
  }

  static function banOfNationality(nationality){
    this.ofNationality(nationality).then((users) => {
      users.forEach((user) => {
        user.ban()
      })
    })
  }
}
```

Then you should setup the DB connection. Place in your .env file the following keys:

| **Variable**          | **Default value** | **Description**                                         |
| --------------------- | :---------------: | ------------------------------------------------------- |
| DB\_CONNECTION\_LIMIT |         10        | The max amount of simultaneous connections to the pool. |
| DB\_HOST              |     localhost     | The host of the database                                |
| DB\_USER              |        root       | The user to login with on the database                  |
| DB\_PASSWORD          |       admin       | The password of the database                            |
| DB\_DATABASE          |      default      | The name of the database                                |



Use the QueryBuilder to build your queries. Here are some examples:

```javascript
// get user with id 1
User.find(1).then((result) => {
  // do stuff...
});

// get user with first_name 'John'
User.where("first_name", "John").first().then((result) => {
  // do stuff...
});

// get all users younger than 50 (can also await response)
const users = await User.where("age", "<", 50).get();

// create a new user
const user = new User({ first_name: "John", last_name: "Doe", age: 30 });
user.save();

//or with the one liner
User.create({ first_name: "John", last_name: "Doe", age: 30 });

// update user name where id = 1
const user = await User.find(1);
user.first_name = "Jane";
user.save();

//or with the one liner
User.update({ id: 1, first_name: "Jane" });

// delete user where id = 1
User.delete(1);

// delete current user
const user = // retrieve current user
user.delete()

// get user name of the person that wrote x post
User.select("first_name")
  .join("posts", "posts.user_id", "users.id")
  .where("posts.id", 1)
  .first().then((result) => {
    // do stuff...
  });
```

<br>
<br>

## Nota Bene

- ### Because of how mysql js package is made, all queries are asynchronous. Remember to behave accordingly and await or resolve the promises.

- ### There might and probably will be bugs. If for some reason you end up using this and you find any, please report them in a github issue.
