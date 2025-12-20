import { DataTypes } from "sequelize";

export default (sequelize) => {
    const ArticleVersion = sequelize.define("ArticleVersion", {
        articleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
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
            defaultValue: () => [] 
        },
        versionNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        }
    });

    ArticleVersion.associate = (models) => {
        ArticleVersion.belongsTo(models.Article, { foreignKey: "articleId" });
    };

    return ArticleVersion;
};


