'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Members',
      'description',
      Sequelize.STRING
    );

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'Members',
      'description'
    );
  }
}