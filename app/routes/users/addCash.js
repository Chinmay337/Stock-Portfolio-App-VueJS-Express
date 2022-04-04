/*
    Add cash balance
    Input:
    {
        amount: 2500.00
    }

    Logic:
        Get details of the given user.
        Return error if not valid user
        Update User with new balance.
*/
const dbModelService = require("../../service/dbModelService");

const usersDB = require("../../database/usersDB");
const User = usersDB.getUserModel();

module.exports = async (req, res, next) => {
  console.log(req.body);
  const id = req.params.uid;
  console.log(`Adding balance to user with id: [${id}]`);

  try {
    let depositAmount = parseFloat(req.body.amount);
    if (Number.isNaN(depositAmount)) {
      res.status(400).send("Invalid amount");
      return;
    }
    depositAmount = dbModelService.getRoundedAmount(depositAmount);

    // create a filter for the user to update
    const filter = { _id: id };

    let dbResult = await User.find(filter);
    if (dbResult.length <= 0) {
      res.status(400).send("Invalid user ID");
      return;
    }

    let user = dbModelService.getAppUserModel(dbResult[0]);

    // Now update USER balance.
    let updateDoc = {
      $set: {
        balance: dbModelService.getRoundedAmount( user.balance + depositAmount),
      },
    };

    // Update the user in database
    const result = await User.updateOne(filter, updateDoc);
    console.log("Full result", result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }

  res.sendStatus(200);
};
