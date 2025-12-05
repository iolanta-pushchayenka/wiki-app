import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Article = sequelize.define("Article", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        attachments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: []
        },
        workspaceId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Article.associate = (models) => {
        Article.belongsTo(models.Workspace, { foreignKey: "workspaceId" });
        Article.hasMany(models.Comment, {foreignKey: "articleId", onDelete: "CASCADE"
        });
    };

    return Article;
};


