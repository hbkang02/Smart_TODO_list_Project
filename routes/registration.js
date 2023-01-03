/*
registration routing
 */

const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
  res.render('registration');
});

router.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();
  if (email === '' || req.body.password === '') {
    res.sendStatus(400);
  } else {
    users[id] = { id, email, password };
    req.session.user_id = id;
    res.redirect("/");
  }
});

module.exports = router;
