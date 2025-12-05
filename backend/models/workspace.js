import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Workspace = sequelize.define("Workspace", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Workspace.associate = (models) => {
        Workspace.hasMany(models.Article, { foreignKey: "workspaceId" });
    };

    return Workspace;
};
