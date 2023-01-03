const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  user: 'lhlmidterm',
  password: '123',
  database: 'midterm'
});

const getUserWithEmail = function (email) {
  return pool
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
  return pool
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


