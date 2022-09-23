const {Like, sequelize} = require('../models');
const {Recipe} = require('../models');
const pluck = require('arr-pluck');


module.exports = {
    async getLikedRecipes (req, res) {
        try {

          // Find all user's likes
          let { UserId } = req.query;

          // if(RecipeId){
          //   const likedRecipes = await Like.findAll({
          //     where: {
          //       UserId: UserId,
          //       RecipeId: RecipeId
          //     },
          //     attributes: ['RecipeId'],
          //     raw: true
          //   })
          // } else {

              const likedRecipes = await Like.findAll({
                where: {
                  UserId: UserId,
                },
                attributes: ['RecipeId'],
                raw: true
              })


          // Pull out recipe IDs
          const recipeIdArray = pluck(likedRecipes, 'RecipeId')
          console.log("LIKED RECIPE IDS:", recipeIdArray)

          // Find recipes with those IDs
          const foundRecipes = await Recipe.findAll({ where: { id: recipeIdArray } });
          // console.log("Found recipes: ", foundRecipes)

          // Generates the tags, which are stored as a string joined by pipe characters and needs to be split into an array
          foundRecipes.forEach(splitTags);
          function splitTags(item) {
            item.tags = item.tags.split('|')
          }
          
          res.send(foundRecipes);

        } catch (err) {
          console.log(err);
          res.status(500).send({
            error: 'An error has occurred trying to get your liked recipes!'
          })
        }
    },
    async postLikes (req, res) {
        try {
          console.log(req.body)
          const {RecipeId, UserId, Title} = req.body;
          // Checks to see if a like already exists
          const checkLike = await Like.findOne({
            where:{
                UserId: Number(UserId),
                RecipeId: Number(RecipeId)
            }
          })
          if(checkLike){
            return res.status(400).send({error: 'You\'ve already liked this'});
          }
  
          console.log(req.body);
          const newLike = await Like.create({
            UserId: Number(UserId),
            RecipeId: Number(RecipeId),
            Title: Title
            // These are stored as numbers in the database and need to be converted.
        })
          res.send(newLike);
        } catch (err) {
          console.log(err);
          res.status(500).send({
            error: 'An error has occurred trying to create your Like!'
          })
        }
    },
    async deleteLikes (req, res) {
        try {
          const {id} = req.params;
          console.log(id)
          const deletedLike = await Like.findOne({
            where: {
              id: id
            }
          })
          await deletedLike.destroy();
          res.send(deletedLike);
          }
        catch (err) {
          console.log(err);
          res.status(500).send({
          error: 'An error has occurred trying to delete your Like!'
          })
        }
    }
  }