'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('History', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER
      },
      bookId: {
        type: Sequelize.INTEGER
      },
      borrowDate: {
        type: Sequelize.STRING
      },
      returnDate: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('History');
  }
};