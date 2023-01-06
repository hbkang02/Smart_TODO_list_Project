// render update page
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { getUserWithId, updateUserInfo } = require("../database");

router.get("/", (req, res) => {
  // If user is not logged in, they will be redirected to login
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect("/login");
  }
  return getUserWithId(req.session.userId)
    .then((user) => {
      let templateVars = {
        userId: req.session.userId,
        user: user,
      };
      res.render("profile", templateVars);
    });
});

router.post("/", (req, res) => {
  const userId = req.session.userId;
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 12);
  const name = req.body.update_name;
  if (name === "" || email === "" || req.body.password === "") {
    res.sendStatus(400);
  }
  const update = { name, email, password };
  updateUserInfo(update, userId).then(() => {
    res.redirect("/");
  });
});

module.exports = router;
