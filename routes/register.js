/*
registration routing
 */

const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const users = {}
router.get('/', (req, res) => {
  res.render('registration');
});

router.post("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = 6;
  if (email === '' || req.body.password === '') {
    res.sendStatus(400);
  } else {
    users[id] = { id, email, password };
    console.log(users)
    res.redirect("/");
  }
});

module.exports = router;
