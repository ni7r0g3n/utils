![Util version](https://img.shields.io/badge/Version-0.1-orange?style=for-the-badge)
![Development status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)

<br>
<br>

# **nORMjs** <div style="float: right"> ![javascript logo](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/20px-JavaScript-logo.png?20120221235433) </div>

nORMjs (node ORM js) is a simple ORM for node.js express apps. It is designed to be simple and easy to use. It is also designed to be very flexible and customizable. It is designed to be used with MySQL, but it can be used with any SQL database with a little tweaking.

<br>

## Installation

This doesn't require any installation. Just include these files in your application and require them as needed.
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

## Usage

Once you placed the models in your project you can create your models. Example:

```javascript
const Model = require("../Models/Model");

class User extends Model {
  constructor(initialData) {
    super(User, initialData); // Initial data is optional. Use it to directly load the new model.
  }

  function banUser() {
    // ...
    // define custom login in your models
    // ...
  }

  function ofNationality(query, nationality) {
    // ...
    // define custom scopes in your models
    return query.where('nationality', nationality);
    // ...
  }
}
```

Then you should setup the DB connection. Open the DB.js file and edit the connection settings. I suggest you use some kind of env to keep your credentials secure. Example:

```javascript
this.connection = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});
```

Use the QueryBuilder to build your queries. Here are some examples:

```javascript
// get user with id 1
const user = new User().find(1);

// get user with first_name 'John'
const user = new User().where("first_name", "John").first();

// get all users with less than 50 years
const users = new User().where("age", "<", 50).get();

// create a new user
const user = new User({ first_name: "John", last_name: "Doe", age: 30 });
user.save();

//or with the one liner
new User().create({ first_name: "John", last_name: "Doe", age: 30 });

// update user name where id = 1
const user = new User().find(1);
user.first_name = "Jane";
user.save();

//or with the one liner
new User().find(1).update({ first_name: "Jane" });

// delete user where id = 1
new User().find(1).delete();

// get user name of the person that wrote x post
const user = new User()
  .select("first_name")
  .join("posts", "posts.user_id", "users.id")
  .where("posts.id", 1)
  .first();
```

<br>
<br>

## Nota Bene

- ### Remember to instantiate a new model every time you need to perform a query. This is needed so that under the hood, the query builder knows which table to query and with which parameters.

- ### There might and probably will be bugs. If for some reason you end up using this and you find any, please report them in a github issue.
