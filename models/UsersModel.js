const bcrypt = require('bcrypt');

async function hashPassword(user){
    if(!user.changed('password')){
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        // This generates a salt
        const hashPasswordValue = await bcrypt.hash(user.password, salt);
        // Then the password is hashed with the salt
        user.setDataValue('password', hashPasswordValue);
        // This will update the password value with the new encrypted password
    } catch (error) {
        console.log(error);
    }
}
// This function encrypts the user's info. The salt adds further protection by adding another password to the user's encrypted password on the server.

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        email: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING},
    },
    {
        hooks: {beforeSave: hashPassword}
        // We are passing in a hook here, which is an event that allows us to run something when it is triggered.
        // Here we are hashing the password before it is saved
    });

    User.prototype.comparePassword = async function (password) {
        try {
            const validPassword = await bcrypt.compare(password, this.password);
            return validPassword;
            // This is a method that compares the unencrypted password that we are passing in to the encrypted version stored in the model in the database
            // If it's a match it will return true
        } catch (error) {
            console.log(error);
        }
    }
    // This method decrypts the password, because it's handy to have this built into the model so we can go .comparePassword, pass in a password and check to see if it's valid        
    // Use of "prototype" here allows us to attach a function to the model
    // Sequelize attaches some methods to every model we create such as create, update , delete, find and change.
    return User;
}

