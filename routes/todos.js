const express = require('express');
const router = express.Router();

const db = require('../db/connection');
const { fetchCategory } = require('./api_helper/api_category');
const { addTodo } = require('../database');
const { Categories } = require('../configs');
const { jar } = require('request-promise-native');

const getUsersToDos = function (userId) {
  const text = `
  SELECT * FROM todos
  WHERE user_id = $1`;
  const values = [userId];

  return db.query(text, values)
    .then(data => data.rows)
    .catch(err => console.error(this, 'query failed', err.stack));
};

router.get("/", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.send('Not logged in!');
    return;
  }

  getUsersToDos(userId)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));

});


router.post('/', (req, res) => {
  const userId = req.session.userId;
  console.log("session2: " + req.session.userId);
  if (!userId) {
    res.redirect('/');
    // res.send('Not logged in!!');
    return;
  }
  if (!req.body.category_id) {
    fetchCategory(req.body.todo_name)
      .then((catRes) => {
        addTodo({
          category_id: Object.keys(Categories).find(key => Categories[key] === catRes.className),
          user_id: userId,
          todo_name: req.body.todo_name,
        })
        res.redirect('/');
        return;
      })
  } else {
    addTodo({
      category_id: req.body.category_id,
      user_id: userId,
      todo_name: req.body.todo_name,
    }).then(() => {
      res.redirect('/');
      return;
    })
  }
});


router.post('/:todoId', (req, res) => {
  const queryString = `
  DELETE FROM todos
  WHERE user_id = $1
  AND id = $2;`;
  const queryParams = [req.session.userId, req.params.todoId];

  db.query(queryString, queryParams)
  .then(data => {
    console.log(data);
    console.log('data deleted');
    res.redirect('/');
    return;
  }).catch(err => {
    res.send(err)
  })
});


module.exports = router;
