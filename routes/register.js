/*
registration routing
 */

const { addUser } = require("../database");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getUserWithEmail } = require("../database");

router.get("/", (req, res) => {
  let templateVars = {
    userId: req.session.email,
  };
  res.render("registration", templateVars);
});

router.post("/", (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 12);
  const name = req.body.name;
  if (email === "" || req.body.password === "") {
    res.sendStatus(400);
  } else {
    getUserWithEmail(email).then((user) => {
      if (user) {
        res.redirect("/login");
      } else {
        let user = { name, email, password };
        addUser(user)
          .then((user) => {
            if (!user) {
              res.send({ error: "error" });
              return;
            }
            req.session.userId = user.id;
            res.redirect("/");
            console.log("redirected");
          })
          .catch((e) => res.send(e));
      }
    });
  }
});

module.exports = router;
