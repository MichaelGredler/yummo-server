const Joi = require('joi') // Joi is used to validate user input
// const passwordComplexity = require("joi-password-complexity");

module.exports = {
    //Middleware - Joi Validation
    register(req, res, next) {
        //Joi schema
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().regex(
                new RegExp('^[a-zA-Z0-9]{8,32}$')
            ).required()
        })
        //Using Joi schema to validate user data
        const test = { error, value } = schema.validate(req.body)
        console.log("TEST: ", test.value)
        console.log("ERROR: ", test.error);
        // passwordComplexity().validate("aPassword123!");

        //If there is a error
        if (error) {
            //Switch statement checks what error occurred and send back a message to the user about the error
            switch (error.details[0].context.key) {
                case 'email':
                    console.log('email');
                    res.status(400).send({
                        error: 'You must provide a valid email address'
                    })
                    break;
                case 'password':
                    console.log('password');
                    res.status(400).send({
                        error: `The password failed to match the requirements:
                        
                        1. It must contain ONLY the following characters: lowercase, uppercase, numbers
                       
                        2. Must be between 8 and 32 characters
                        `
                    })
                    break;
                default:
                    console.log('general');
                    res.status(400).send({
                        error: 'Invalid registration information'
                    })
            }
        } else {
            next()
        }
    }
}
