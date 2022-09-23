// Here we need to talk to our database and this is done through the models.
const {Recipe} = require('../models');
const {Op} = require('../models'); // Bring in Sequelizes operators
const {sequelize} = require('../models/index'); 

module.exports = {
    async getRecipes(req, res) {
        try {
            let recipes = null;
            const search = req.query.search; // If the user searched this will get their query from the address bar after the ?
            const searchTags = req.query.search;

            if(search) {
                recipes = await Recipe.findAll({
                    where: {
                        [Op.or]: [
                            { title: { [Op.like]: `%${search}%`} },
                            { author: { [Op.like]: `%${search}%`} },
                            { difficulty: { [Op.like]: `%${search}%`} },
                            // { ingredients: { [Op.like]: `%${search}%`} },
                            { tags: { [Op.like]: `%${search}%`} },
                        ],
                    },
                });
                
                recipes.forEach(splitTags);
                function splitTags(item) {
                  item.tags = item.tags.split('|')
                }

                recipes.sort((a, b) => {
                  return b.likes - a.likes;
                });
                
                res.send(recipes);
    
            // Here we are passing in an option to findAll.
            // "where" is where the results are similar to the following
            // "Op.or" or operator for potential matching results
            // "Op.like" if the title is similar to the search then find and return that one
                        
          } else { 
            
            // else if(searchTags) {

            //   recipes = await Recipe.findAll({
            //     where: { tags: `%${search}%` }
            //   })
            //   res.send(recipes);

            
                // If there was no search then we get everything. This can be limited to 10 items by passing in "limit: X" as an object
                recipes = await Recipe.findAll({limit: 20});
                
                

                recipes.forEach(splitTags);
                function splitTags(item) {
                  item.tags = item.tags.split('|')
                }


                recipes.sort((a, b) => {
                  return b.likes - a.likes;
                });

                res.send(recipes);
            }

        } catch (err) {
            console.log(err);
            res.status(500).send("Sorry we could not connect to the database");
            // res.status(500) is the error code meaning something went wrong on the server
        }
    },

    async postRecipes(req, res) {
      try {
        
        // let reqBodyIngs = await req.body.ingredients;
        
        // let joinedIngs = reqBodyIngs.join('|');
        // console.log(joinedIngs);
        

        // console.log(req.body.ingredients.join('|'));
        req.body.ingredients = req.body.ingredients.join('|');
        req.body.method = req.body.method.join('|');
        
        // console.log(req.body);
        let newRecipe = await Recipe.create(req.body);
        res.send(newRecipe);
        // This variable will store the result from the database
        // Every model in Sequelize has a method in it called create, and we just need to pass inthe data that we want saved in the database. 
        // req.body will go to the user's request and pull the data out of the body. The data's format needs to match what is in the database.
      } catch (err) {
        console.log(err);
        res.status(500).send("Sorry we could not connect to the database");
      }
        
    },

    async getRecipesById(req, res) {
        try {
          console.log(req.params.id);
          let gottenGuide = await Recipe.findOne({where: { id: req.params.id }});
          gottenGuide.ingredients = gottenGuide.ingredients.split('|');
          gottenGuide.method = gottenGuide.method.split('|');
          gottenGuide.tags = gottenGuide.tags.split('|');
          // gottenGuide.method = gottenGuide.method.split('|');
          // ,
          //   get() {
          //       return this.getDataValue('method').split('|')
          //   }
          res.send(gottenGuide);
        } catch (err) {
          console.log(err)
          res.status(500).send({error: "We could not get your stuff!"});
        }
    },

    async putRecipesById(req, res) {
      try {

        // When functionality is added to allow users to post recipes, the ingredients and method will be delivered in arrays. Here these arrays are joined before storing in the database.
        
        console.log("AAAAAAAAAAAAA!!!!!!!!!!!!!!!!", req.params.id)
        // req.body.ingredients = req.body.ingredients.join('|');
        // req.body.method = req.body.method.join('|');
        req.body.ingredients = req.body.ingredients.join('|');
        req.body.method = req.body.method.join('|');
        req.body.tags = req.body.tags.join('|');
        let recipeUpdate = await Recipe.update(req.body, {where: {id: req.params.id}});
        res.send("The data was updated!!!");
      } catch (err) {
        console.log(err)
        res.status(500).send(err);
        // In this case we are sending the error message back as an object, which makes it easy to handle if you are working with something like React
      }
    },
    // Here we want to pull the ID we want to update out of the request.
    // "req.body" is data that is sent in the HTTP body of the request
    // And we can also access the address bar. There's 2 bits of data: params and queries.
    // Here we access the ID with "req.params.id". This is based on what we have named it in routes.js - '/instructionguides/:id'
    // So we run the .update function using the user's request body, on the record where the id matches the user's params.id
    // Put is an update query. Information about model querying is here 
    // https://sequelize.org/master/manual/model-querying-basics.html

    // Often we want to send back the updated record to the user, so we put it in a variable and send it back as a response

    async getRandomRecipe(req, res) {
      try {
          let recipes = null;
        
          // WORKING: Get single random recipe
          // recipes = await Recipe.findOne({order: sequelize.random()});

          // NOT WORKING: Get multiple randoms
          // recipes = await Recipe.findAll({ order: sequelize.literal('rand()'), limit: 5 })
          recipes = await Recipe.findAll({ order: sequelize.random(), limit: 5 })

          // recipes.forEach(splitTags);
          // function splitTags(item) {
          //   item.tags = item.tags.split('|')
          // }

          res.send(recipes);

      } catch (err) {
          console.log(err);
          res.status(500).send("Your recipes could not be found!!!!!!");
      }
    }

}