const {sequelize, User, Recipe, Like} = require('../models'); // Deconstruct stuff from Models folder
const bluebird = require('bluebird'); // Bluebird is a promise library. This allows you to turn normal synchronous code into an async code.
const delay = require('delay');

const recipes = require('./recipes.json');
const likes = require('./likes.json');
const users = require('./users.json');


// Here we have imported our models, Bluebird and Delay and also our data from the .json files.


sequelize.sync({force: true}).then(async function(){
    await bluebird.all(
        users.map((item) => {
            User.create(item);
        })
    )

    await bluebird.all(
        recipes.map(item => {
            Recipe.create(item);
        })
    )
    
    await delay(1000);
    await bluebird.all(
        likes.map(item => {
            Like.create(item);
        })
    )
}).catch((err) => {
    console.log(err);
})


// First sequelize syncs (???). Then we loop over one of our .json files and then create that data in our database. 
// We are using Map to do this which is not an async function. This is where we can use Bluebird to make it into an async function.
// "Users.create(user)" refers to our Users model and creates a new row in our table using the data we are passing in by mapping over our data in the user.json file. 
// "force: true" removes any data from the database before repopulating it with the new data from our seed.
