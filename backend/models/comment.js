import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Comment = sequelize.define("Comment", {
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.Article, { foreignKey: "articleId" });
        Comment.belongsTo(models.User, { foreignKey: "userId" });
    };

    return Comment;
};
