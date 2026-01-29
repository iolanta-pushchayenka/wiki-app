'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Articles',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false 
        }, 

        title: {
          type: Sequelize.STRING,
          allowNull: false
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
        },
      });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Articles');
  }
};
