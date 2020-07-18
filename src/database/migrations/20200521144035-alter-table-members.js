'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Members', 'facebook', {
            type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Members', 'instagram', {
            type: Sequelize.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('Members', 'linkedin', {
          type: Sequelize.STRING,
        }, { transaction: t }),
        queryInterface.removeColumn('Members', 'dutyDate', { transaction: t }),
        queryInterface.removeColumn('Members', 'dutyTime', { transaction: t }),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Members', 'facebook', { transaction: t }),
        queryInterface.removeColumn('Members', 'instagram', { transaction: t }),
        queryInterface.removeColumn('Members', 'linkedin', { transaction: t }),
        queryInterface.addColumn('Members', 'dutyDate', {
          type: Sequelize.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('Members', 'dutyTime', {
          type: Sequelize.STRING,
        }, { transaction: t })
      ])
    })
  }
};
