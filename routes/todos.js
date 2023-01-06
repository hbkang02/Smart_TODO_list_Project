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
    .then((_) => {
      res.redirect('/');
      return;
    }).catch(err => {
      res.send(err)
    })
});

router.post('/edit/:todoId', (req, res) => {
  // req.session.todoId is null at start.
  // console.log("todoid: " + req.session.todoId);
  if (!req.session.todoId || (req.session.todoId != req.params.todoId)) {
    req.session.todoId = req.params.todoId;
    return res.redirect('/');
  }

  if (!req.body.category_id) {
    fetchCategory(req.body.todo_name)
      .then((catRes) => {
        return updateDatabase(req.body.todo_name, catRes.className, req.session.todoId)
        .then((_) => {
          req.session.todoId = null;
          return res.redirect('/');
        });
      });
  } else {
    return updateDatabase(req.body.todo_name, Categories[req.body.category_id], req.session.todoId)
    .then((_) => {
      req.session.todoId = null;
      res.redirect('/');
      return;
    });
  }
});

router.get('/cancel', (req, res) => {
  req.session.todoId = null;
  res.redirect('/');
});


const updateDatabase = function (todo_name, category, todoId) {
  return db.query(`
UPDATE todos
SET todo_name = $1, category_id= $2
WHERE id = $3;`,
  [
    todo_name,
    Object.keys(Categories).find(key => Categories[key] === category),
    todoId
  ]);
};


module.exports = router;
