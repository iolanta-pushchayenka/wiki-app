'use strict';

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }

  });

  return Article;
};
