/*
    Sell Stock.
    DELETE api/user/:uid/pos/:id

    Logic:
        Get details of the given pos.
        Return error if not valid stock pos OR not same user
        Calulate current selling price.
        Add selling price to the user balance
        Remove stock position record. Update User with new balance.
*/
const dbModelService = require("../../service/dbModelService");
const stockService = require("../../service/stockService");

const usersDB = require("../../database/usersDB");
const User = usersDB.getUserModel();
const StockPos = usersDB.getStockPosModel();

module.exports = async (req, res, next) => {
  const uid = req.params.uid;
  const id = req.params.id;
  console.log(`Removing POS #${id} from user with id: [${uid}]`);

  try {
    const posFilter = { _id: id, userid: uid };
    let dbResult = await StockPos.find(posFilter);
    if (dbResult.length <= 0) {
      res.status(400).send("Invalid position ID or user ID");
      return;
    }

    const pos = dbModelService.getAppPosModel(dbResult[0]);

    const userFilter = { _id: uid };
    dbResult = await User.find(userFilter);

    if (dbResult.length <= 0) {
      res.status(400).send("Invalid user ID");
      return;
    }

    const user = dbModelService.getAppUserModel(dbResult[0]);

    let stockDetail = await stockService.getStockDetails(pos.symbol);
    if (!stockDetail) {
      res.status(400).send("Invalid stock symbol");
      return;
    }

    const sellingPrice = dbModelService.getRoundedAmount(pos.quantity * stockDetail.price);

    let result = await StockPos.findByIdAndRemove(id);
    console.log("Delete POS result", result);

    // Now update USER balance.
    let updateDoc = {
      $set: {
        balance: dbModelService.getRoundedAmount(user.balance + sellingPrice),
      },
    };

    // Update the user in database
    result = await User.updateOne(userFilter, updateDoc);
    console.log("Update user result", result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
  res.sendStatus(200);
};
