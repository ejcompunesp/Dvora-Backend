'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('feedback', {
      id: {
        type: Sequelize.INTEGER,
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('feedback');
  }
};
