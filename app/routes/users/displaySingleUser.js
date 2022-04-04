const js2xmlparser = require("js2xmlparser");
const dbModelService = require("../../service/dbModelService");
const stockService = require("../../service/stockService");

const usersDB = require("../../database/usersDB");
const User = usersDB.getUserModel();
const StockPos = usersDB.getStockPosModel();

// display all users

module.exports = async (req, res, next) => {
  const id = req.params.id;
  console.log(`Finding user with id: [${id}]`);

  let dbResult;
  try {
    dbResult = await User.find({ _id: id });
  } catch (err) {
    res.sendStatus(404);
    return;
  }

  if (dbResult.length <= 0) {
    res.sendStatus(404);
    return;
  }

  let user = dbModelService.getAppUserModel(dbResult[0]);
  let stockValue = 0.0;

  dbResult = await StockPos.find({ userid: id });
  if (dbResult.length > 0) {
    user.portfolio = await Promise.all(
      dbResult.map(async (pos) => {
        let entry = dbModelService.getAppPosModel(pos);
        let currentPrice = await stockService.getStockDetails(entry.symbol);
        if (currentPrice) {
          entry.currentPrice = currentPrice.price;
          stockValue += dbModelService.getRoundedAmount(currentPrice.price * entry.quantity);
        }

        return entry;
      })
    );
  }

  const balance = { cash: user.balance, stock: stockValue };
  user.balance = balance;

  res.format({
    "application/json": () => {
      res.json(user);
    },
    "application/xml": () => {
      res.send(js2xmlparser.parse("user", user));
    },
  });

  // https://www.robinwieruch.de/node-express-server-rest-api/
  // https://stackabuse.com/building-a-rest-api-with-node-and-express/
};
