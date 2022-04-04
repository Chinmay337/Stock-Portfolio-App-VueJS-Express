const js2xmlparser = require('js2xmlparser');
const dbModelService = require('../../service/dbModelService');

const usersDB = require('../../database/usersDB');
const User = usersDB.getUserModel();

// display all users

module.exports = async (req, res, next) => {

    let dbUsers = await User.find({});

    let result = dbUsers.map(dbModelService.getAppUserModel);

    res.format({
        "application/json": () => {
            res.json(result);
        },
        "application/xml": () => {
          res.send(  js2xmlparser.parse("users",{user: result}));
        }
    });

    // https://www.robinwieruch.de/node-express-server-rest-api/
    // https://stackabuse.com/building-a-rest-api-with-node-and-express/

};