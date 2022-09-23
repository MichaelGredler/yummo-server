const Joi = require('joi');

module.exports = {
    recipeValidation(req, res, next) {

        const schema = Joi.object({
            title: Joi.string().min(2).max(50).required(),
            author: Joi.string().max(50),
            serves: Joi.number().integer().required(),
            cookingTimeHrs: Joi.number().integer().required(),
            cookingTimeMins: Joi.number().integer().required(),
            // image: Joi.image().minDimensions(450, 600).maxDimensions(900, 1200).allowTypes(['jpg', 'png', 'webp']),
            image: Joi.string(),
            difficulty: Joi.string().required(),
            tags: Joi.array(),
            likes: Joi.number(),
            ingredients: Joi.array().items(Joi.string().max(1500).required()),
            
            method: Joi.array().items(Joi.string().max(2500).required())

            

            // For ings and method
            // const schema = Joi.array().items(Joi.string(), Joi.number()); // array may contain strings and


        })

        const { error, value } = schema.validate(req.body)
        console.log("Error: ", error);

        //If there is a error
        if (error) {
            //Switch statement checks what error occurred and send back a message to the user about the error
            switch (error.details[0].context.key) {
                case 'title':
                    console.log('title');
                    res.status(400).send({
                        error: 'You must name your recipe'
                    })
                    break;
                case 'author':
                    console.log('author');
                    res.status(400).send({
                        error: 'Please provide a name for the author'
                    })
                    break;
                case 'serves':
                    console.log('serves');
                    res.status(400).send({
                        error: 'Please specify the number of serves'
                    })
                    break;
                case 'cookingTimeHrs':
                    console.log('cookingTimeHrs');
                    res.status(400).send({
                        error: 'How long does your recipe take to make?'
                    })
                    break;
                case 'cookingTimeMins':
                    console.log('cookingTimeHrs');
                    res.status(400).send({
                        error: 'How long does your recipe take to make?'
                    })
                    break;
                case 'difficulty':
                    console.log('difficulty');
                    res.status(400).send({
                        error: 'Please let us know how difficult your recipe is to make'
                    })
                    break;
                case 'ingredients':
                    console.log('ingredients');
                    res.status(400).send({
                        error: 'You must list your ingredients'
                    })
                    break;
                case 'method':
                    console.log('method');
                    res.status(400).send({
                        error: 'You must provide a method for your recipe'
                    })
                    break;                                        
                default:
                    console.log('general');
                    res.status(400).send({
                        error: 'Invalid recipe information'
                    })
            }
        } else {
            next()
        }
    
  
    }
}