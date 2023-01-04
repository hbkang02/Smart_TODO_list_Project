const db = require('./db/connection');

const getUserWithEmail = function (email) {
  return db
    .query(`SELECT * FROM users`)
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

const addUser = function (user) {
  console.log('hit', user)
  console.log(db)
  const name = user.name
  const password = user.password
  const email = user.email
  return db
    //.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *;`, [name, password, email])
    .query(`SELECT * from users`)
    .then((result) => {
      console.log('users', result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log('error hit')
      console.log(err.message);
    });
};
exports.addUser = addUser;