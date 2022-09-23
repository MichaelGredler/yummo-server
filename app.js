const express = require('express'); // Bring in Express
const bodyParser = require('body-parser') //bodyParser allows json data to be easily read
const cors = require('cors'); // Bring in Cors
const config = require('./config/config');
const path = require('path');

const {sequelize} = require('./models/index'); 
// Gets the Sequelize object we created from our models/index.js file. "index" is the default file to load here, so you don't actually need to write index.

const app = express(); 
// Start Express - express has a default function which starts express

const publicUploadFolder = path.normalize(__dirname + "/images");
app.use("/images", express.static("images"));
console.log(publicUploadFolder)

app.use(bodyParser.json());
app.use(cors()); 
// Tell Express to use Cors, this is a piece of middleware that is being passed into our Express module
app.use(express.json()); 
// This runs a method inside Express called json that allows Express to interpret JSON
 
require('./routes')(app); 
//Brings in routes.js. Could also be imported at the top and used as a piece of middleware. (app) passes in our app variable and makes is available for routes.js.

sequelize.sync().then(() => {
    app.listen(config.port);
    console.log(`Server started on port ${config.port}`);    
})


// This tells our index.js file in models to run. This needs to happen after the application starts up and just before the server starts.
// ".sync" syncs all of our models to the database. It will go and read all of our models and create those same structures in the database.
// ".then" is a promise and does the same thing here as async and await.
// So once everything is synced up then it runs app.listen and starts the server.
