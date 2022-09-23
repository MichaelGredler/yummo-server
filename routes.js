const AuthenticationController = require('./controllers/AuthenticationController'); // Allows users to register and login
const AuthPolicy = require('./policies/AuthPolicy');
const LikesController = require('./controllers/LikesController');
const RecipesController = require('./controllers/RecipesController');
const RecipesPolicy = require('./policies/RecipesPolicy');

module.exports = (app) =>{    
    // This wraps all the endpoints in an export while passing in the Express app that was made available from app.js

    // Home
    app.get('/', (req, res) => {
        res.send("Homepage");
    });
    // Login
    app.post('/register',AuthenticationController.register); 
    app.post('/login', AuthenticationController.login);

    // Recipes
    app.get('/recipes', RecipesController.getRecipes); 
    app.get('/imfeelinglucky', RecipesController.getRandomRecipe);
    app.post('/recipes', RecipesPolicy.recipeValidation, RecipesController.postRecipes);
    app.get('/recipes/:id', RecipesController.getRecipesById);
    app.put('/recipes/:id', RecipesController.putRecipesById);

      
    // Likes
    app.get('/likes', LikesController.getLikedRecipes); 
    app.post('/likes', LikesController.postLikes); 
    app.delete('/likes/:id', LikesController.deleteLikes); 
    
    // Coming Soon
    app.get('/coming-soon');

}