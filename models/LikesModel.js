module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {
        Title: {type: DataTypes.STRING}
    });

    // This creates an association between users and recipes for each like created
    Like.associate = function(models){
        Like.belongsTo(models.User);
        Like.belongsTo(models.Recipe);
    }

    return Like;
}