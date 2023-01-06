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

// This adds todos
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
//deletes if logged in
router.post("/delete", (req, res) => {
  const user = req.session.user_id;
  const id = req.params.id;
  // if (!user) {
  //   res.status(404).send('account does not exist or is not logged in');
  // } else if (!urlDatabase[id]) {
  //   res.status(404).send('link not found');
  // } else if (user !== urlDatabase[id].userId) {
  //   res.status(404).send('no access allowed');
  // } else {
  console.log('big success')
  res.redirect("/");
  //}
});

module.exports = router;
