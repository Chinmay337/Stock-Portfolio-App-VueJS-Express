const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup handlebars view engine

const handlebars = require("express-handlebars");

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// 	handlebars({defaultLayout: 'main'}));

// static resources
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  //	res.render('homeView');
  res.redirect("/app/users");
});

app.get("/app/users", function (req, res) {
  res.render("userList");
});

app.get("/app/userDetails/:id", function (req, res) {
  res.render("userDetails", { id: req.params.id });
});

// Routing
var routes = require("./routes/index");
app.use("/api", routes);

app.use(function (req, res) {
  res.status(404);
  res.render("404");
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
