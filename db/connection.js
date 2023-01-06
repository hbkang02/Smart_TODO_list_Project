// PG database client/connection setup
const { Pool } = require('pg');
const { Categories } = require('../configs')

const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

const db = new Pool(dbParams);

db.connect();

db.query(`DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  category_name VARCHAR(255) NOT NULL
);`).then(() => {
  for (let [keys, values] of Object.entries(Categories)) {
    db.query(`
  INSERT INTO categories (
    id,
    category_name )
  VALUES (
    $1,
    $2);
    `, [keys, values])
    .catch((err) => {
      console.log("Catch: ", err.message);
    });
  }
})



module.exports = db;
