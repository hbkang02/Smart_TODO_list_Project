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
  let templateVars = {
    userId: req.session.email,
  };
  res.render('login', templateVars);
});

router.post('/', (req, res) => {
  const { email, password } = req.body;
  login(email, password)
    .then(user => {
      if (!user || !password) {
        res.redirect('/login');
        return;
      }
      req.session.userId = user.id;
      res.redirect('/');ßßß
      return;
    })
    .catch(e => res.send(e));
});

module.exports = router;
