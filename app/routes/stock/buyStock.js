/*
    Buy Stock.
    Input:
    {
        symbol:"AAPL",
        quantity: 25
    }

    Logic:
        Get details of the given symbol.
        Return error if not valid stock
        Calulate total purchase price.
        Return error if purchase price > user balance

        Add stock position record. Update User with new balance.
*/
const dbModelService = require("../../service/dbModelService");
const stockService = require("../../service/stockService");

const usersDB = require("../../database/usersDB");
const User = usersDB.getUserModel();
const StockPos = usersDB.getStockPosModel();

module.exports = async (req, res, next) => {
  console.log(req.body);
  const uid = req.params.uid;
  console.log(`Adding ${req.body.symbol} to user with id: [${uid}]`);

  try {
    let quantity = parseInt(req.body.quantity, 10);
    if (Number.isNaN(quantity) || quantity < 1) {
      res.status(400).send("Invalid quantity given");
      return;
    }

    const filter = { _id: uid };
    let dbResult = await User.find(filter);

    if (dbResult.length <= 0) {
      res.status(400).send("Invalid user ID");
      return;
    }
    let user = dbModelService.getAppUserModel(dbResult[0]);

    let stockDetail = await stockService.getStockDetails(req.body.symbol);
    if (!stockDetail) {
      res.status(400).send("Invalid stock symbol");
      return;
    }

    const totalPrice = dbModelService.getRoundedAmount(quantity * stockDetail.price);
    if (totalPrice > user.balance) {
      res.status(400).send(`Insufficient balance. Need ${totalPrice} (${stockDetail.price} * ${quantity})`);
      return;
    }

    let pos = new StockPos({
      userid: uid,
      symbol: stockDetail.symbol,
      name: stockDetail.name,
      quantity: quantity,
      purchasePrice: dbModelService.getRoundedAmount(stockDetail.price),
      purchaseDate: Date.now(),
    });

    // Persist this position in database
    await pos.save();

    // Now update USER balance.
    let updateDoc = {
      $set: {
        balance: dbModelService.getRoundedAmount(user.balance - totalPrice),
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
