'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ArticleVersions',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        articleId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Articles', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        attachments: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: []
        },
        versionNumber: {
          type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('ArticleVersions');
  }
};
