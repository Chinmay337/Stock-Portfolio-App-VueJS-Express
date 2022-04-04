const  yahooFinance = require('yahoo-finance');
// https://www.npmjs.com/package/yahoo-finance

module.exports.getStockDetails = async (symbol) => {
  let result;
  try {
    var quote = await yahooFinance.quote({
      symbol: symbol,
      modules: ["price"],
    });

    if (!quote || !quote.price || !quote.price.longName) {
      return null;
    }
    // console.log(quote);
 
    result = {
      symbol: quote.price.symbol,
      name: quote.price.longName,
      price: quote.price.regularMarketPrice,
      dailyHigh: quote.price.regularMarketDayHigh,
      dailyLow: quote.price.regularMarketDayLow,
      volume: quote.price.regularMarketVolume,
    };

  } catch (err) {
    console.log(err);
    result = null;
  }

  return result;
};
