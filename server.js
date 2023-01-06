// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const sass = require("sass");
const app = express();
const { getUserWithId, getTodo } = require("./database");

app.set("view engine", "ejs");



// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static("public"));
app.use(
  cookieSession({
    name: "session",
    keys: ["password1"],
  })
);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require("./routes/users-api");
const widgetApiRoutes = require("./routes/widgets-api");
const loginApiRoutes = require("./routes/login");
const todosApiRoutes = require("./routes/todos");
const usersRoutes = require("./routes/users");
const register = require("./routes/register");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`

app.use("/api/users-api", userApiRoutes);
app.use("/api/widgets", widgetApiRoutes);
app.use("/todo", todosApiRoutes);
app.use("/login", loginApiRoutes);
app.use("/users", usersRoutes);
app.use("/register", register);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/register");
  }
  return getUserWithId(req.session.userId)
  .then ((user) => {
    // Get items
    getTodo(req.session.userId)
    .then(todoRes => {
      const readItems = [];
      const watchItems = [];
      const buyItems = [];
      const eatItems = [];

      const f = function (id, todo_name, created_date) {
        return {
          id,
          todo_name,
          created_date: new Date(Date.parse(created_date)).toDateString()
        };
      };

      todoRes.forEach(todo => {
        switch(todo.category_id) {
          case 1:
            readItems.push(f(todo.id, todo.todo_name, todo.created_date));
            break;
          case 2:
            watchItems.push(f(todo.id, todo.todo_name, todo.created_date));
            break;
          case 3:
            eatItems.push(f(todo.id, todo.todo_name, todo.created_date));
            break;
          case 4:
            buyItems.push(f(todo.id, todo.todo_name, todo.created_date));
            break;
        }
      });

      let templateVars = {
        userId: req.session.userId,
        user,
        readItems,
        watchItems,
        buyItems,
        eatItems,
        editItemId: req.session.todoId
      };
      res.render("index", templateVars);
    });
  });
});

app.post("/logout", (request, response) => {
  request.session.userId = null;
  request.session = null;
  response.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
