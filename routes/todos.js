const express = require('express');
const router = express.Router();

const db = require('../db/connection');

const getUsersToDos = function(userId) {
  const text = `
  SELECT * FROM todos
  WHERE user_id = $1`;
  const values = [userId];

  return db.query(text, values)
    .then(data => data.rows)
    .catch(err => console.error(this, 'query failed', err.stack));
};

router.get("/", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.send('Not logged in!');
    return;
  }

  getUsersToDos(userId)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));

});

module.exports = router;
