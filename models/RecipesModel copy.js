// This file is going to talk to the database. In here we are defining the structure of the 
// table that is going to store the instruction guide data. 
// Sequelize lets us do all of this with Javascript.
// We need to create a Schema which will define the structure of the table.

module.exports = (sequelize, DataTypes) => {
    const Recipe = sequelize.define("Recipe", {
        // Here we define fields in the InstructionGuide table and their data types
        title: {type: DataTypes.STRING},
        author: {type: DataTypes.STRING},
        serves: {type: DataTypes.STRING},
        cookingTimeHrs: {type: DataTypes.STRING},
        cookingTimeMins: {type: DataTypes.STRING},
        image: {type: DataTypes.STRING},
        difficulty: {type: DataTypes.STRING},
        likes: {type: DataTypes.INTEGER},
        tags: {
            type: DataTypes.TEXT,
            get() {
                return this.getDataValue('tags').split('|')
            }
        },
        ingredients: {
            type: DataTypes.TEXT,
            get() {
                return this.getDataValue('ingredients').split('|')
            }
        },
        method: {
            type: DataTypes.TEXT,
            get() {
                return this.getDataValue('method').split('|')
            }
        }
    })
    return Recipe;
}
