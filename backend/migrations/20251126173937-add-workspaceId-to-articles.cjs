'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Articles', 'workspaceId', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1, 

          references: {
            model: 'Workspaces',
            key: 'id'
          },
          onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Articles', 'workspaceId');
  }
};

