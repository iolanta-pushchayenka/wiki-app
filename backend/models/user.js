import { DataTypes } from "sequelize";

export default (sequelize) => {
    const User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM("admin", "user"),
            allowNull: false,
            defaultValue: "user"
        }
    });


    User.associate = (models) => {
        User.hasMany(models.Article, { foreignKey: "userId" });
        User.hasMany(models.Comment, { foreignKey: "userId" });
        User.hasMany(models.Workspace, { foreignKey: "userId" });
    };

    return User;
};



