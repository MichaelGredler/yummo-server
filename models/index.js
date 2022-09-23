// This file runs when the server starts. It will look in the models folder for any models, then generate tables for those models in our database.
// This code is based on code from the Sequelize documentation

const fs = require('fs'); // The file system module
const path = require('path');
const SequelizeClass = require('sequelize');
const config = require('../config/config');

const sequelize = new SequelizeClass(
    config.db.database,
    config.db.username,
    config.db.password,
    config.db.options
);
// Here we make a new Sequelize object from the Sequelize class. The Sequelize constructor has 4 values that we can pass in: database, username, password and options. We get this data from our config file.

const db = {};
// This variable will help us to access the Sequelize class and Sequelize object from outside 

const modelsFiles = fs.readdirSync(__dirname).filter((file) => file !== 'index.js');
// This looks in the current directory and grabs all the files that are not index.js

modelsFiles.forEach((file) => { 
     const model = require(path.join(__dirname, file))(sequelize, SequelizeClass);
     db[model.name] = model;
})
// Then we loop over and run the functions within those files, passing in the sequelize object and the sequelize class. Then this is all saved into the db variable.


Object.keys(db).forEach(function (modelName) {
    if('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
})
// This loops over our array of models and checks if there are any associations and if so turn them on


db.sequelize = sequelize;
db.SequelizeClass = SequelizeClass;
// Here we store Sequelize the object and Sequelize the class inside our db object, in addition to all the models we just put in there.

module.exports = db;
module.exports.Op = SequelizeClass.Op;
// The Op bit exports some information from inside Sequelize. Op are operators that let us perform queries we will use later for Sequelize such as checking to see if a table contains some data, retrieving certain records, etc.