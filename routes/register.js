/*
registration routing
 */

const { addUser } = require('../database')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getUserWithEmail } = require('../database')

router.get('/', (req, res) => {
  res.render('registration');
});

router.post("/", (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 12);
  const name = req.body.name;
  if (email === '' || req.body.password === '') {
    res.sendStatus(400);
  } else {
    getUserWithEmail(email)
      .then((user) => {
        if (user) {
          res.redirect("/");
        } else {
          let user = { name, email, password };
          req.session.userId = user.id;
          addUser(user)
            .then(user => {
              if (!user) {
                res.send({ error: "error" });
                return;
              }
              res.send("🤗");
            })
            .catch(e => res.send(e));
        }
      })

  }

});

module.exports = router;
