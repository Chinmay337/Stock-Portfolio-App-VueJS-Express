const UsersDB = require("./usersDB");
const User = UsersDB.getUserModel();
const StockPos = UsersDB.getStockPosModel();

(async () => {
  await User.deleteMany({});

  let user1 = new User({ firstName: "John", lastName: "Smith", balance: 100.0 });
  let user2 = new User({ firstName: "Jane", lastName: "Smith", balance: 150.0 });
  let user3 = new User({ firstName: "John", lastName: "Doe", balance: 250.0 });
  let user4 = new User({ firstName: "Mike", lastName: "Gonzalez", balance: 200.0 });

  await Promise.all([user1.save(), user2.save(), user3.save(), user4.save()]);

  console.log("Listing current users");
  let currentUsers = await User.find({});

  console.log(currentUsers);


  await StockPos.deleteMany({});

  // For first user
  let uid1 = currentUsers[0]._id;
  let uid2 = currentUsers[1]._id;

  let pos1=new StockPos( { userid:uid1, symbol:"T", name:"AT&T Inc.", quantity:50, purchasePrice: 22.11, purchaseDate : new Date(2021,12,4)} );
  let pos2=new StockPos( {userid:uid1, symbol:"AAPL", name:"Apple Inc.", quantity:2, purchasePrice: 158.23, purchaseDate : new Date(2021,12,6)} );
  
  let pos3=new StockPos( { userid:uid2, symbol:"T", name:"AT&T Inc.", quantity:25, purchasePrice: 22.15, purchaseDate : new Date(2021,6,14)} );
  let pos4=new StockPos( {userid:uid2, symbol:"AMZN", name:"Amazon.com, Inc.", quantity:1, purchasePrice: 2976.93, purchaseDate : new Date(2021,10,17)} );
 
  let pos5=new StockPos( { userid:currentUsers[2]._id, symbol:"C", name:"Citigroup Inc.", quantity:30, purchasePrice: 60.25, purchaseDate : new Date(2021,9,30)} );
  let pos6=new StockPos( {userid:currentUsers[3]._id, symbol:"AMZN", name:"Amazon.com, Inc.", quantity:1, purchasePrice: 3015.37, purchaseDate : new Date(2021,11,26)} );
 

  await Promise.all([pos1.save(), pos2.save(), pos3.save(), pos4.save(), pos5.save(), pos6.save()]);

  console.log("Listing current positions");
  let currentPositions = await StockPos.find({});

  console.log(currentPositions);





  process.exit();
})();
