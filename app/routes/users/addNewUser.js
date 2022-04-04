const js2xmlparser = require("js2xmlparser");
const dbModelService = require("../../service/dbModelService");

const usersDB = require("../../database/usersDB");
const User = usersDB.getUserModel();

module.exports = async (req, res, next) => {
  console.log(req.body);

  let user;

  try {
    // Create user object with given data

    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      balance: req.body.balance,
    });

    // Persist this employee in database
    await user.save();
    user = dbModelService.getAppUserModel(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }

  res.format({
    "application/json": () => {
      res.json(user);
    },
    "application/xml": () => {
      res.send(js2xmlparser.parse("user", user));
    },
  });
};
