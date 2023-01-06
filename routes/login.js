const { getUserWithEmail } = require('../database')

const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();


function login(email, password) {
  return getUserWithEmail(email)
    .then(user => {
      if (!user) {
        return null;
      }
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    })
    .catch(e => {
      return null;
    });
}

router.get('/', (req, res) => {
  res.render('login');
});

module.exports = router;

router.post('/', (req, res) => {
  const { email, password } = req.body;
  login(email, password)
    .then(user => {
      if (!user || !password) {
        res.status(400).send("You need to provide an email and password to login. Please <a href='/login'>Login</a>");
        return;
      }
      console.log("found user: " + user.name)
      req.session.userId = user.id;
      console.log("session: " + req.session.userId);
      res.redirect('/');
      return;
    })
    .catch(e => res.send(e));
});

module.exports = router;
