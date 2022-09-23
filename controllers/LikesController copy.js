const {Like, sequelize} = require('../models');
const {Recipe} = require('../models');
const pluck = require('arr-pluck');


module.exports = {
    async getLikedRecipes (req, res) {
        try {

          // let {UserId} = req.query;
          // let gottenLikes = await Like.findAll({
          //     where: {
          //       UserId: UserId}
          // }).success(
          //   console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
              // gottenLikes.forEach((item) => {
              //   let recipeId = item.RecipeId;
              //   likedRecipeIds.push(recipeId);
              // })
            // )
          

          // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA", likedRecipeIds);

          // .find({where: {id: {in: [1,2,3,4]}}}).success(...)


          // Get all User's Likes
          let { UserId } = req.query;
          const likedRecipes = await Like.findAll({
            where: {
              UserId: UserId
            },
            attributes: ['RecipeId'],
            raw: true
          })
          const recipeIdArray = pluck(likedRecipes, 'RecipeId')
          console.log(recipeIdArray)
          const foundRecipes = await Recipe.findAll({ where: { id:  recipeIdArray  } });
          console.log("Found recipes: ", foundRecipes)
          
          // .then((userLikes) => {
          //   // Pull out RecipeIds - don't need because of Pluck
          //   // const likedRecipeIdsArray = [];
          //   // userLikes.forEach((item) => {
          //   //     let recipeId = item.RecipeId;
          //   //     likedRecipeIdsArray.push(recipeId);
          //   //   }
          //   // )
          //   // console.log("LIKED RECIPE IDs: ", likedRecipeIdsArray)

          //   // Get liked recipes by RecipeId
          //   const foundRecipesArray = [];
          //   const data = userLikes.forEach(async (RecipeId) => {
          //           let foundRecipe = await Recipe.findOne({where: { id: RecipeId }});
                    
          //           console.log("AAAAAAAAAAAA", likedRecipe);
          //           foundRecipesArray.push(foundRecipe);
          //           // likedRecipeArray.push(RecipeId);
          //       })

            // console.log(data)
            
            

            // console.log("LIKED RECIPES ARRAY: ", likedRecipeArray)

          

            // likedRecipeIds.forEach((item) => {
            //   let gottenRecipe = async () => {
            //     await Recipe.findOne({where: { id: item }});
            //   }
            //   console.log(gottenRecipe);

            //   gottenLikedRecipes.push({
            //     title: gottenRecipe.title,
            //     serves: gottenRecipe.serves,
            //     cookingTime: gottenRecipe.cookingTime,
            //     cookingTimeMins: gottenRecipe.cookingTimeMins,
            //     image: gottenRecipe.image,
            //     difficulty: gottenRecipe.difficulty,
            //     likes: gottenRecipe.likes,
            //     ingredients: gottenRecipe.ingredients
            //   })
            //   // console.log(gottenRecipe.dataValues)
            // })

            // console.log("GOTTEN LIKED RECIPES", gottenLikedRecipes)
            // res.send(gottenLikedRecipes);
          
    


        } catch (err) {
          console.log(err);
          res.status(500).send({
            error: 'An error has occurred trying to get your Like!'
          })
        }
    },
    async postLikes (req, res) {
        try {
          console.log(req.body)
          const {RecipeId, UserId, Title} = req.body;
          const checkBookmark = await Like.findOne({
            where:{
                UserId: Number(UserId),
                RecipeId: Number(RecipeId)
            }
          })
     
          if(checkBookmark){
            return res.status(400).send({error: 'You already have this bookmarked!'});
          }
  
          console.log(req.body);
          const newBookmark = await Like.create({
            UserId: Number(UserId),
            RecipeId: Number(RecipeId),
            Title: Title
            // These are stored as numbers in the database and need to be converted.
        })
          res.send(newBookmark);
        } catch (err) {
          console.log(err);
          res.status(500).send({
            error: 'An error has occurred trying to create your Like!'
          })
        }
    },
    async deleteLikes (req, res) {
        try {
          const {bookmarkId} = req.params;
          const deletedBookmark = await Like.findOne({
            where: {
              id: bookmarkId
            }
          })
          await deletedBookmark.destroy();
          res.send(deletedBookmark);
          }
        catch (err) {
          console.log(err);
          res.status(500).send({
          error: 'An error has occurred trying to delete your Like!'
          })
        }
    }
  }