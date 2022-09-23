const path = require('path');

module.exports = {
    port: process.env.PORT || 8081,
    db: {
        database: process.env.DB_NAME || 'database',
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'root',
        options: {
            dialect: process.env.DIALECT || 'sqlite',
            host: process.env.HOST || 'localhost',
            storage: path.resolve(__dirname, '../database.sqlite')
            // sqlite is a light version of SQL. It does not need a server, but creates a file and saves data locally on the user's system.
        }
    },

    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'password'
    }
    // This is the secret that is used in the signature for the user's authentication token created in AuthenticationController.js
    // It should be an environmental variable stored on the server or on locally on the system
}