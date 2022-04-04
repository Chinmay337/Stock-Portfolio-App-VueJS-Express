const js2xmlparser = require("js2xmlparser");
const stockService = require("../../service/stockService");

// Search for stock prices

module.exports = async (req, res, next) => {
  const symbol = req.params.symbol;
  let result;
  try {
    result = await stockService.getStockDetails(symbol);
    if (!result) {
      res.sendStatus(404);
      return;
    }
    console.log(result);
  } catch (err) {
    console.log(err);
    result = err;
  }

  res.format({
    "application/json": () => {
      res.json(result);
    },
    "application/xml": () => {
      res.send(js2xmlparser.parse("stock", result));
    },
  });
};
