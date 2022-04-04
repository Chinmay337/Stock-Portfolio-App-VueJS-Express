const js2xmlparser = require("js2xmlparser");
const dbModelService = require("../../service/dbModelService");

const usersDB = require("../../database/usersDB");
const User = usersDB.getUserModel();

module.exports = async (req, res, next) => {
  console.log(req.body);
  const id = req.params.id;
  console.log(`Updating user with id: [${id}]`);

  let user;

  try {
    // create a filter for the user to update
    const filter = { _id: id };

    // create a document that sets the updated employee data
    let updateDoc = {
      $set: {},
    };

    if (req.body.firstName && req.body.lastName) {
      updateDoc.$set.firstName = req.body.firstName;
      updateDoc.$set.lastName = req.body.lastName;
    }

    if (req.body.balance) {
      updateDoc.$set.balance = req.body.balance;
    }

    // Update the user in database
    const result = await User.updateOne(filter, updateDoc);
    console.log("Full result", result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }

  res.sendStatus(200);

  //   res.format({
  //     "application/json": () => {
  //       res.json(user);
  //     },
  //     "application/xml": () => {
  //       res.send(js2xmlparser.parse("user", user));
  //     },
  //   });
};
