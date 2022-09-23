const {User} = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function jwtSignUser(user){
    const tokenExpireTime = 60 * 60 * 24 * 14; // Will last for 14 days
    return jwt.sign(user, config.authentication.jwtSecret, {expiresIn: tokenExpireTime});
    // jwt.sign will generate a token. We pass the user's info into the payload, then we create a signature for the token with a password stored in the config file, then we enter an expiry time for the token
}
// This function generates a token if the password is correct

// This contains methods that talk to the database to allow the user to register and log in
module.exports = {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            const emailExists = await User.findOne({
                where: {
                    email: email
                }
            })
            if (emailExists) {
                return res.status(401).send({
                    error: 'A profile with that email already exists!'
                })
            } else {
                const newUser = await User.create(req.body);
                const newUserJSON = newUser.toJSON();
                res.send({
                    user: newUserJSON,
                    token: jwtSignUser(newUserJSON)
                })
                // Here we create and new user, then converts that data to JSON, then send a response.
                // So someone hits the register endpoint and sends us their email and password.
                // Then we send that back to them together with a token.
            }
        } catch (error) {
            res.status(400).send({error: "This email is already in use"});
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body  //Collect the user input
            //Finds the matching email in the database
            const existingUserProfile = await User.findOne({
                where: {
                    email: email
                }
            })
            //If no matching user in the database
            if (!existingUserProfile) {
                console.log("The login information was incorrect");
                return res.status(401).send({
                    error: 'The login information was incorrect'
                })
            }

            //If the password does not match
            const isPasswordValid = await existingUserProfile.comparePassword(password) //compares the password with the hashed password in the database
            if (!isPasswordValid) {
                console.log("The password was incorrect");
                return res.status(401).send({
                    error: 'The login information was incorrect'
                })
            }

            //If the login details are correct sends back a token
            const userJSON = existingUserProfile.toJSON()
            console.log(userJSON)
            res.send({
                user: userJSON,
                token: jwtSignUser(userJSON) // Passes the user data to jwtSignUser to be stored into the token
            });

        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'A errors has occurred well trying to login'
            });
        }
    }

}