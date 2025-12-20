import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Article = sequelize.define("Article", {
        workspaceId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Article.associate = (models) => {
        Article.belongsTo(models.Workspace, { foreignKey: "workspaceId" });
        Article.hasMany(models.Comment, { foreignKey: "articleId", onDelete: "CASCADE" });
        Article.hasMany(models.ArticleVersion, { foreignKey: "articleId", onDelete: "CASCADE" });
        Article.belongsTo(models.User, { foreignKey: "userId" });
    };

    return Article;
};
