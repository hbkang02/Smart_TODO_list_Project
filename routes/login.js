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
      // if (bcrypt.compareSync(password, user.password)) {
      //   return user;
      // }
      if (password === user.password) {
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
      if (!user) {
        res.send({ error: "error no user found" });
        return;
      }
      console.log("found user: " + user.name)
      req.session.userId = user.id;
      console.log("session: " + req.session.userId);
      // res.send({user: {name: user.name, email: user.email, id: user.id}}); // make redirection to '/'
      res.redirect('/');
      return;
    })
    .catch(e => res.send(e));
});

module.exports = router;
