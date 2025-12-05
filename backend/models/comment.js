import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Comment = sequelize.define("Comment", {
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.Article, { foreignKey: "articleId" });
    };

    return Comment;
};
