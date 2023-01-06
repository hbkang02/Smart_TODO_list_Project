const db = require('./db/connection');


const getUserWithEmail = function (email) {
  return db
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log("Catch: ", err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;

const getUserWithId = function (id) {
  return db
    .query(`
    SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log("Catch: ", err.message);
    });
}
exports.getUserWithId = getUserWithId;

//may need join********************
const addTodo = function (todo) {
  console.log("cat: " + todo.category_id + " type: " + typeof(todo.category_id));
  db.query(`
  INSERT INTO todos (
    category_id,
    user_id,
    todo_name)
  VALUES (
    $1,
    $2,
    $3
  );`, [
    todo.category_id,
    todo.user_id,
    todo.todo_name])
    .catch((err) => {
      console.log("Catch: ", err.message);
    });
};

exports.addTodo = addTodo;

const getTodo = function (userId) {
  return db.query(`
  SELECT * from todos WHERE user_id = $1;`, [userId])
  .then(res => {
    return res.rows;
  })
};

exports.getTodo = getTodo;

const addUser = function (user) {
  const name = user.name
  const password = user.password
  const email = user.email
  return db
    .query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *;`, [name, password, email])
    .then((result) => {
      console.log('users', result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;
