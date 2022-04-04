var express = require("express");
var router = express.Router();

// other modules

const displayAllUsers = require("./users/displayAllUsers");
const displaySingleUser = require("./users/displaySingleUser");
const addNewUser = require("./users/addNewUser");
const updateUser = require("./users/updateUser");
const removeUser = require("./users/removeUser");
const addCash = require("./users/addCash");

const buyStock = require("./stock/buyStock");
const sellStock = require("./stock/sellStock");

const searchStock = require("./stock/searchStock");

router.get("/users", displayAllUsers);
router.get("/users/:id", displaySingleUser);
router.post("/users", addNewUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", removeUser);
router.post("/users/:uid/cash", addCash);

router.post("/users/:uid/pos", buyStock);
router.delete("/users/:uid/pos/:id", sellStock);

router.get("/search/:symbol", searchStock);

module.exports = router;

/*
    **  api/users               GET - List all users
    **  api/users/:id           GET - Details of a single user
    **  api/users               POST - Add new user
    **  api/users/:id           PUT - Update user
    **  api/users/:id           DELETE - Update user

    **  api/users/:uid/pos      POST - Add new stock position (Buy operation)
    **  api/users/:uid/pos/:id  DELETE - Sell given stock position

    **  api/search/:symbol	GET - Search for given ticker and get details

    api/user/:uid/cash	POST - Add cash balance


*/
