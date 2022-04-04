const mongoose = require("mongoose");

const credentials = require("./credentials.js");

// const dbUrl = 'mongodb+srv://' + credentials.username +
// 	':' + credentials.password + '@' + credentials.host + '/' + credentials.database;

// URL for database without auth
// const dbUrl = `mongodb://${credentials.host}:${credentials.port}\${credentials.database}`;

// URL for database with username & password
const dbUrl = `mongodb://${credentials.username}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}`;

let connection = null;
let userModel = null;
let posModel=null;

let Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    //id: String,
    firstName: String,
    lastName: String,
    balance: Number
  },
  {
    collection: "users_bhelke",
  }
);

const posSchema = new Schema(
  {
   // id: String,
    userid: String,
    symbol: String,
    name: String,
    quantity: Number,
    purchasePrice: Number,
    purchaseDate: Date
  },
  {
    collection: "stockpos_bhelke",
  }
);

module.exports = {
  getUserModel: () => {
    if (connection == null) {
      console.log("Creating connection and user models...");

      connection = mongoose.createConnection(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    if(userModel == null){
      userModel = connection.model("UserModel", usersSchema);
    }
    return userModel;
  },

  getStockPosModel: () => {
    if (connection == null) {
      console.log("Creating connection and models...");

      connection = mongoose.createConnection(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    if(posModel == null){
      posModel = connection.model("StockPosModel", posSchema);
    }
    return posModel;
  },
};
