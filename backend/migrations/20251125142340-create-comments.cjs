'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },

        articleId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Articles',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },

        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
        },

        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
        }
      });
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};
