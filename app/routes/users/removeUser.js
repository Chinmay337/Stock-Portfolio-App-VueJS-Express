const usersDB = require("../../database/usersDB");
const User = usersDB.getUserModel();
const StockPos = usersDB.getStockPosModel();

module.exports = async (req, res, next) => {
  console.log(req.body);
  const id = req.params.id;
  console.log(`Deleting user with id: [${id}]`);

  try {
    // Update the user in database
    const result = await User.findByIdAndRemove(id);
    console.log("Delete user result", result);

    if (!result || result._id != id) {
      // Erro deleting...
      res.status(404).send("User not found");
      return;
    }

    // Now remove portfolio of the user.

    const posResult = await StockPos.deleteMany({ userid: id });
    console.log("Delete pos result", posResult);
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
