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
<<<<<<< HEAD
  const userId = req.session.userId;
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c28b77c (Add more layout, move login form to header)
=======
>>>>>>> 934b179 (Change some styling)
  const userId = req.session.userId;
=======
  const userId = req.session.user_id;
>>>>>>> 765eea4 (Add more layout, move login form to header)
<<<<<<< HEAD
<<<<<<< HEAD
=======
  const userId = req.session.userId;
>>>>>>> 9616b93 (Change some styling)
=======
>>>>>>> c28b77c (Add more layout, move login form to header)
=======
=======
  const userId = req.session.userId;
>>>>>>> 9616b93 (Change some styling)
>>>>>>> 934b179 (Change some styling)
>>>>>>> bc0490f (Change some styling)
  if (!userId) {
    res.send('Not logged in!');
    return;
  }

  getUsersToDos(userId)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));

});

router.post("/", (req, res) => {
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
        res.send('TODO Created');
        return
      })
  } else {
    addTodo({
      category_id: req.body.category_id,
      user_id: userId,
      todo_name: req.body.todo_name,
    }).then(() => {
      res.send('TODO Created');
      return;
    })
  }

  res.send('Something went wrong')
})

module.exports = router;
