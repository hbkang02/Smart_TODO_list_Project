/*
registration routing
 */

const { addUser } = require('../database')
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.use(cookieSession({
  name: 'session',
  keys: ['password1']
}));


router.get('/', (req, res) => {
  res.render('registration');
});

router.post("/", (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password);
  const name = req.body.name;
  if (email === '' || req.body.password === '') {
    res.sendStatus(400);
  } else {
    let user = { name, email, password };
    addUser(user)
      .then(user => {
        console.log(user)
        if (!user) {
          res.send({ error: "error" });
          return;
        }
        req.session.userName = user.name;
        res.send("🤗");
      })
      .catch(e => res.send(e));
  }
  res.redirect("/");
});

module.exports = router;
