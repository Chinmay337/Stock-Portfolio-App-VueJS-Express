
const roundToCents=  (value) => {
  const cents = Math.round(value * 100);
  return cents / 100.0;
};

module.exports = {
  getAppUserModel: (ele) => {
    return {
      id: ele._id,
      firstName: ele.firstName,
      lastName: ele.lastName,
      balance: roundToCents(ele.balance),
    };
  },

  getAppPosModel: (ele) => {
    return {
      id: ele._id,
      userid: ele.userid,
      symbol: ele.symbol,
      name: ele.name,
      quantity: ele.quantity,
      purchasePrice:roundToCents( ele.purchasePrice),
      purchaseDate: ele.purchaseDate,
    };
  },

  getRoundedAmount: (value) => {
   return roundToCents(value);
  },
};
