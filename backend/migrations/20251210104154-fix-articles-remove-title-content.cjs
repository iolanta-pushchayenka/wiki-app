'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Articles', 'title');
    await queryInterface.removeColumn('Articles', 'content');
    await queryInterface.removeColumn('Articles', 'attachments');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Articles', 'title', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn('Articles', 'content', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    await queryInterface.addColumn('Articles', 'attachments', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });
  }
};
